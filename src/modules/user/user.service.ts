import { UpdateProfileInput } from './dto/update-profile.input';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Injectable } from '@nestjs/common';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { PrismaService } from '../prisma/prisma.service';
import { UserOrder } from './dto/user-order.input';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationArgs, query: string, orderBy: UserOrder) {
    const { skip, after, before, first, last } = pagination;

    const users = await findManyCursorConnection(
      (args) =>
        this.prisma.user.findMany({
          where: {
            username: { startsWith: query || '' },
          },
          orderBy: orderBy ? { name: orderBy.direction } : null,
          ...args,
        }),
      () =>
        this.prisma.user.count({
          where: {
            username: { startsWith: query || '' },
          },
        }),
      { first, last, before, after },
    );

    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    return user;
  }

  async uploadPhoto(user: User, url: string): Promise<boolean> {
    if (!url) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: url,
      },
    });

    return true;
  }

  async deletePhoto(user: User): Promise<boolean> {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: null,
      },
    });

    return true;
  }

  async updateProfile(user: User, input: UpdateProfileInput): Promise<boolean> {
    const { name, username, bio } = input;

    const userByUsername = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    const currentUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (userByUsername && userByUsername.id !== currentUser.id) {
      throw new Error('This username is already in use');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        username,
        bio,
      },
    });

    return true;
  }
}
