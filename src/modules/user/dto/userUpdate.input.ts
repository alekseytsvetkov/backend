import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';

@InputType()
export class UserUpdateInput {
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Length(3, 32)
  name: string;

  @Field((type) => String)
  bio?: string;
}
