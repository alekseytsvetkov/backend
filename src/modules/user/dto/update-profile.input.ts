import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput {
  @Field()
  name?: string;

  @Field()
  username?: string;

  @Field()
  bio?: string;
}
