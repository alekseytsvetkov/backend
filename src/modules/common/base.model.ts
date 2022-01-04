import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';

export enum Locale {
  EN = 'EN',
  RU = 'RU',
}

registerEnumType(Locale, {
  name: 'Locale',
});

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  @Field((type) => ID)
  id: string;

  @Field({
    description: 'Identifies the date and time when the object was created.',
  })
  createdAt: Date;

  @Field({
    description:
      'Identifies the date and time when the object was last updated.',
  })
  updatedAt: Date;
}
