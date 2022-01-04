import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { SignupInput } from './dto/signup.input';
import { Prisma, User } from '@prisma/client';
import { Token } from './models/token.model';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from '../../config/config.interface';
import { PrismaService } from '../prisma/prisma.service';
import { generateSmsCode, twilioClient } from '../../utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly config: ConfigService,
  ) {}

  async sendSmsCode(phone: string) {
    const phoneAlreadyUsed = await this.prisma.user.findFirst({
      where: {
        phone,
      },
    });

    if (phoneAlreadyUsed) {
      throw new Error('This phone is already in use');
    }

    const code = generateSmsCode();

    let hasError = null;

    await twilioClient.messages
      .create({
        body: `${code}`,
        from: process.env.TWILIO_PHONE,
        to: `+${phone}`,
      })
      .then((message) => console.log(message.sid))
      .catch((error) => (hasError = error));

    if (hasError) {
      return false;
    }

    const sms = await this.prisma.sms.create({
      data: {
        phone,
        code: `${code}`,
      },
    });

    if (!sms) {
      return false;
    }

    return true;
  }

  async confirmSmsCode(phone: string, code: string) {
    const sms = await this.prisma.sms.findFirst({
      where: {
        phone,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!sms || sms.code !== `${code}`) {
      return false;
    }

    const smsConfirmed = await this.prisma.sms.update({
      where: {
        id: sms.id,
      },
      data: {
        confirmed: true,
      },
    });

    if (!smsConfirmed) {
      return false;
    }

    return true;
  }

  async signup(input: SignupInput): Promise<Token> {
    const { phone, name, username, code, password } = input;

    const phoneConfirmed = await this.prisma.sms.findFirst({
      where: {
        AND: [
          {
            code,
          },
          {
            confirmed: true,
          },
        ],
      },
    });

    if (!phoneConfirmed) {
      throw new Error('This phone is not confirmed');
    }

    const hashedPassword = await this.password.hashPassword(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          phone,
          name,
          username,
          password: hashedPassword,
        },
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`This username is already in use.`);
      } else {
        throw new Error(e);
      }
    }
  }

  async login(username: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new NotFoundException(`No user found: ${username}`);
    }

    const passwordValid = await this.password.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwt.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwt.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.config.get<SecurityConfig>('security');
    return this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwt.verify(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
