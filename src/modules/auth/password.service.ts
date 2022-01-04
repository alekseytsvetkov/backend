import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { bcrypt, bcryptVerify } from 'hash-wasm';

import { randomBytes } from 'crypto';
@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isValid = await bcryptVerify({
      password,
      hash: hashedPassword,
    });

    return isValid;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);

    const key = await bcrypt({
      password,
      salt,
      costFactor: 11,
      outputType: 'encoded',
    });

    return key;
  }
}
