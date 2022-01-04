import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AlternateName {
  @Field()
  id: string;

  @Field({ nullable: true })
  isoLang?: string;

  @Field({ nullable: true })
  alternateName?: string;

  @Field({ nullable: true })
  isPreferredName?: boolean;

  @Field({ nullable: true })
  isShortName?: boolean;

  @Field({ nullable: true })
  isHistoric?: boolean;
}
