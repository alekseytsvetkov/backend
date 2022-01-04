import { Injectable, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService) {}

  @UseGuards(GqlAuthGuard)
  async findAll() {
    const tags = await this.prisma.story.findMany();

    return tags;
  }
}
