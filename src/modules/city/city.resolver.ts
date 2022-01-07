import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CityService } from './city.service';
import { City } from './models/city.model';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from '../user/user.decorator';
import { User } from '../user/models/user.model';
import { ActionCityInput } from './dto/action-city.input';
import { CitiesInput } from './dto/cities.input';
import { CityConnection } from './models/city-connection.model';
import { CityOrder } from './dto/city-order.input';
import { AuthGuard } from '../auth/guards';

@Resolver(() => City)
export class CityResolver {
  constructor(private readonly city: CityService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => City)
  addCity(@UserEntity() user: User, @Args('input') input: ActionCityInput) {
    return this.city.addCity(user, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => City)
  removeCity(@UserEntity() user: User, @Args('input') input: ActionCityInput) {
    return this.city.removeCity(user, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => City)
  moveCity(@UserEntity() user: User, @Args('input') input: ActionCityInput) {
    return this.city.moveCity(user, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => City, { name: 'city' })
  findOne(@Args('id') id: string) {
    return this.city.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => CityConnection, { name: 'cities' })
  findAll(
    @Args('input', { nullable: true }) input: CitiesInput,
    @Args('skip', { nullable: true }) skip: number,
    @Args('after', { nullable: true }) after: string,
    @Args('before', { nullable: true }) before: string,
    @Args('first') first: number,
    @Args('last', { nullable: true }) last: number,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => CityOrder,
      nullable: true,
    })
    orderBy: CityOrder,
  ) {
    const pagination = { skip, after, before, first, last };
    return this.city.findAll(input, pagination, query, orderBy);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => CityConnection, { name: 'wanted' })
  wanted(
    @Args('skip', { nullable: true }) skip: number,
    @Args('after', { nullable: true }) after: string,
    @Args('before', { nullable: true }) before: string,
    @Args('first') first: number,
    @Args('last', { nullable: true }) last: number,
    @Args({
      name: 'orderBy',
      type: () => CityOrder,
      nullable: true,
    })
    orderBy: CityOrder,
    @Args('userId', { nullable: true }) userId: string,
    @UserEntity() user: User,
  ) {
    const pagination = { skip, after, before, first, last };
    return this.city.findWanted(pagination, orderBy, userId, user);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => CityConnection, { name: 'visited' })
  visited(
    @Args('skip', { nullable: true }) skip: number,
    @Args('after', { nullable: true }) after: string,
    @Args('before', { nullable: true }) before: string,
    @Args('first') first: number,
    @Args('last', { nullable: true }) last: number,
    @Args({
      name: 'orderBy',
      type: () => CityOrder,
      nullable: true,
    })
    orderBy: CityOrder,
    @Args('userId', { nullable: true }) userId: string,
    @UserEntity() user: User,
  ) {
    const pagination = { skip, after, before, first, last };
    return this.city.findVisited(pagination, orderBy, userId, user);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => CityConnection, { name: 'nearby' })
  nearby(
    @Args('skip', { nullable: true }) skip: number,
    @Args('after', { nullable: true }) after: string,
    @Args('before', { nullable: true }) before: string,
    @Args('first') first: number,
    @Args('last', { nullable: true }) last: number,
    @Args({
      name: 'orderBy',
      type: () => CityOrder,
      nullable: true,
    })
    orderBy: CityOrder,
    @UserEntity() user: User,
  ) {
    const pagination = { skip, after, before, first, last };
    return this.city.findNearby(pagination, orderBy, user);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => CityConnection, { name: 'popular' })
  popular(
    @Args('skip', { nullable: true }) skip: number,
    @Args('after', { nullable: true }) after: string,
    @Args('before', { nullable: true }) before: string,
    @Args('first') first: number,
    @Args('last', { nullable: true }) last: number,
    @Args({
      name: 'orderBy',
      type: () => CityOrder,
      nullable: true,
    })
    orderBy: CityOrder,
  ) {
    const pagination = { skip, after, before, first, last };
    return this.city.findPopular(pagination, orderBy);
  }
}
