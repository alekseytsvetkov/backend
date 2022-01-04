import { Resolver, Query } from '@nestjs/graphql';
import { StoryService } from './story.service';
import { Story } from './models/story.model';

@Resolver(() => Story)
export class StoryResolver {
  constructor(private readonly story: StoryService) {}

  @Query(() => [Story], { name: 'stories' })
  findAll() {
    return this.story.findAll();
  }
}
