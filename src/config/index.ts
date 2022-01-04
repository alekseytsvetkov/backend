import * as depthLimit from 'graphql-depth-limit';
import { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    autoSchemaFile: 'schema.gql',
    sortSchema: true,
    validationRules: [depthLimit(10)],
    installSubscriptionHandlers: true,
  },
  security: {
    expiresIn: '2d',
    refreshIn: '7d',
  },
};

export default (): Config => config;
