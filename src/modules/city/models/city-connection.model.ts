import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../common/pagination/pagination';
import { City } from './city.model';

@ObjectType()
export class CityConnection extends PaginatedResponse(City) {}
