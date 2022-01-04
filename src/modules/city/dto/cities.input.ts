import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CitiesInput {
  @Field(() => ID)
  cityTagId: string;
}
