import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CityModule } from './modules/city/city.module';
import { TagModule } from './modules/tag/tag.module';
import { StoryModule } from './modules/story/story.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { config } from './config';
import { AuthService } from './modules/auth/auth.service';
import * as depthLimit from 'graphql-depth-limit';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
    }),
    GraphQLModule.forRootAsync({
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: async () => ({
        uploads: false,
        installSubscriptionHandlers: true,
        validationRules: [depthLimit(10)],
        buildSchemaOptions: {
          numberScalarMode: 'integer',
        },
        autoSchemaFile: './schema.graphql',
        context: ({ req }) => ({ req }),
      }),
    }),
    AuthModule,
    UserModule,
    CityModule,
    TagModule,
    StoryModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }))
      .forRoutes('graphql');
  }
}
