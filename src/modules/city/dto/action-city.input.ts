import { InputType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum AddCityInputType {
  WANT = 'WANT',
  VISITED = 'VISITED',
}

registerEnumType(AddCityInputType, {
  name: 'AddCityInputType',
});

@InputType()
export class ActionCityInput {
  @Field(() => ID)
  id: string;

  @Field()
  type: AddCityInputType;
}
