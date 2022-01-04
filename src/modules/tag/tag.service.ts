import { Injectable, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  @UseGuards(GqlAuthGuard)
  async findAll() {
    const tags = await this.prisma.tag.findMany({
      include: {
        localizations: true,
      },
      where: {
        geonames: {
          some: {},
        },
      },
    });

    return tags;
  }
}
