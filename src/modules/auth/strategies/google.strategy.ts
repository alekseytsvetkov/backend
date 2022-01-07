import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly config: ConfigService) {
    super(config.get('authGoogle'));
  }

  async validate(accessToken, refreshToken, profile) {
    return {
      accessToken,
      refreshToken,
      provider: 'google',
      serviceId: profile?.id,
      name: profile?.display_name,
      email: profile?.email,
      avatar: profile?.profile_image_url,
    };
  }
}
