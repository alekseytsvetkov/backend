import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/base.model';

@ObjectType()
export class Story extends BaseModel {
  @Field()
  title: string;

  @Field()
  description: string;
}
