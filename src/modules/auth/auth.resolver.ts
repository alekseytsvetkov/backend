import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Args } from '@nestjs/graphql';
import { Auth } from './models/auth.model';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { Token } from './models/token.model';
import { RefreshTokenInput } from './dto/refresh-token.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Boolean)
  async sendSmsCode(@Args('phone') phone: string) {
    return this.auth.sendSmsCode(phone);
  }

  @Mutation(() => Boolean)
  async confirmSmsCode(
    @Args('phone') phone: string,
    @Args('code') code: string,
  ) {
    return this.auth.confirmSmsCode(phone, code);
  }

  @Mutation(() => Auth)
  async signup(@Args('input') input: SignupInput) {
    input.username = input.username.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.signup(input);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async login(@Args('input') { username, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.auth.login(
      username.toLowerCase(),
      password,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  @ResolveField('user')
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}
