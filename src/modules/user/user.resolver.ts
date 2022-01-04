import { StorageService } from './../storage/storage.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { PrismaService } from '../prisma/prisma.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UserEntity } from './user.decorator';
import { UserService } from './user.service';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { v4 as uuidv4 } from 'uuid';
import { UserConnection } from './models/user-connection.model';
import { UserOrder } from './dto/user-order.input';
import { UpdateProfileInput } from './dto/update-profile.input';
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly user: UserService,
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.user.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => UserConnection, { name: 'users' })
  findAll(
    @Args('skip', { nullable: true }) skip: number,
    @Args('after', { nullable: true }) after: string,
    @Args('before', { nullable: true }) before: string,
    @Args('first') first: number,
    @Args('last', { nullable: true }) last: number,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => UserOrder,
      nullable: true,
    })
    orderBy: UserOrder,
  ) {
    const pagination = { skip, after, before, first, last };
    return this.user.findAll(pagination, query, orderBy);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Boolean)
  async uploadPhoto(
    @UserEntity() user: User,
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<boolean> {
    const ext = file.filename.match(/\.[a-z]+$/);
    const filename = `${uuidv4()}${ext}`;
    const url = await this.storage.upload({ ...file, filename });
    return await this.user.uploadPhoto(user, url);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Boolean)
  async deletePhoto(@UserEntity() user: User): Promise<boolean> {
    return this.user.deletePhoto(user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Boolean)
  async updateProfile(
    @UserEntity() user: User,
    @Args('input') input: UpdateProfileInput,
  ): Promise<boolean> {
    return this.user.updateProfile(user, input);
  }
}
