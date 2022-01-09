// import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  // Context,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// import { GqlAuthGuard } from './guards';
import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';
import { Token } from './models/token.model';
import { RefreshTokenInput } from './dto/refresh-token.input';
@Resolver(() => Auth)
export class AuthResolver {
  constructor(private auth: AuthService) {}

  @Mutation(() => Auth)
  async signInWithGoogle(@Args('idToken') idToken: string) {
    const { accessToken, refreshToken } = await this.auth.signInWithGoogle(
      idToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return await this.auth.refreshToken(token);
  }

  // @UseGuards(GqlAuthGuard)
  // @Mutation(() => Boolean)
  // async logout(@Context('token') token) {
  //   await this.auth.logout(token);
  //   return true;
  // }

  @ResolveField('user')
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}
