import { Resolver, Query } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { Tag } from './models/tag.model';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tag: TagService) {}

  @Query(() => [Tag], { name: 'tags' })
  findAll() {
    return this.tag.findAll();
  }
}
