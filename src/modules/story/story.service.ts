import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService) {}

  @UseGuards(AuthGuard)
  async findAll() {
    const tags = await this.prisma.story.findMany();

    return tags;
  }
}
