import { City } from './../../city/models/city.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/base.model';

@ObjectType()
export class Image extends BaseModel {
  @Field()
  url: string;

  @Field(() => [City], { nullable: true })
  city?: City[];
}
