import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Token } from './models/token.model';
import { User } from '../user/models/user.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signInWithGoogle(idToken: string) {
    // validate token
    // https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=

    const params = new URLSearchParams();
    params.set('idToken', idToken);

    const res = await this.httpService
      .get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?${params.toString()}`,
      )
      .toPromise()
      .catch(() => {
        throw new Error('Invalid id_token');
      });

    const userInfo = res.data;

    const profileExists = await this.prisma.profile.findFirst({
      where: {
        id: userInfo.sub,
      },
    });

    if (!profileExists) {
      const createUserAndProfile = await this.prisma.user.create({
        data: {
          name: userInfo.name,
          avatar: userInfo.picture,
          profiles: {
            create: {
              id: userInfo.sub,
              provider: 'google',
              name: userInfo.name,
              avatar: userInfo.picture,
            },
          },
        },
      });

      if (!createUserAndProfile) {
        throw new Error('Failed to create user or profile, try again');
      }

      return this.generateTokens({
        userId: createUserAndProfile.id,
      });
    }

    return this.generateTokens({
      userId: profileExists.userId,
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
    const securityConfig = this.config.get('security');
    return this.jwt.sign(payload, {
      secret: securityConfig.jwtAccessSecret,
      expiresIn: securityConfig.refreshIn,
    });
  }

  async refreshToken(token: string) {
    try {
      const { userId } = this.jwt.verify(token, {
        secret: this.config.get('security.jwtAccessSecret'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
