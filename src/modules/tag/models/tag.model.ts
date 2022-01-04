import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/base.model';
import { TagLocalization } from './tagLocalization.model';

@ObjectType()
export class Tag extends BaseModel {
  @Field()
  name: string;

  @Field()
  emoji: string;

  @Field(() => [TagLocalization], { nullable: true })
  localizations?: TagLocalization[];
}
