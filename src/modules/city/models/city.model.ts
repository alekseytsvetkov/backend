import { Field, ObjectType, Float } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { AlternateName } from './alternateName.model';
import { Image } from './image.model';
import { GraphQLBigInt } from '@the-gear/graphql-scalars';

@ObjectType()
export class City {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  overview: string;

  @Field(() => GraphQLBigInt)
  population: bigint;

  @Field({ defaultValue: 0 })
  wantedCount: number;

  @Field({ defaultValue: 0 })
  visitedCount: number;

  @Field(() => [Image], { nullable: true })
  images?: Image[];

  @Field(() => Float, { nullable: true })
  latitude: number;

  @Field(() => Float, { nullable: true })
  longitude: number;

  @Field(() => [User], { nullable: true })
  userWanted: User[];

  @Field(() => [User], { nullable: true })
  userVisited: User[];

  @Field(() => [AlternateName], { nullable: true })
  alternateName: AlternateName[];
}
