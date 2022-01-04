import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../common/pagination/pagination';
import { User } from './user.model';

@ObjectType()
export class UserConnection extends PaginatedResponse(User) {}
