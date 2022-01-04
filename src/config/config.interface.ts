export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  autoSchemaFile: string;
  sortSchema: boolean;
  validationRules: any[];
  installSubscriptionHandlers: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
}
