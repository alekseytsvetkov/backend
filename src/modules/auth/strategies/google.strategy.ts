import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly config: ConfigService) {
    super(config.get('authGoogle'));
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    return {
      accessToken,
      refreshToken,
      provider: 'google',
      serviceId: profile?.id,
      name: `${profile?.name.givenName + ' ' + profile?.name.familyName}`,
      email: profile?.emails[0].value,
      avatar: profile?.photos[0].value,
    };
  }
}
