import { NestFactory } from '@nestjs/core';
import { ApolloGateway } from '@apollo/gateway';
import { AppModule } from './app.module';
import { HeadersDatasource } from './headers.datasource';

// Initialize an ApolloGateway instance and pass it an array of implementing
// service names and URLs
export const gateway = new ApolloGateway({
  serviceList: [
    { name: 'auth', url: 'http://localhost:9900/graphql' },
    { name: 'user', url: 'http://localhost:9000/graphql' },
    { name: 'project', url: 'http://localhost:9100/graphql' },
    // more services
  ],
  buildService({ url }) {
    return new HeadersDatasource({ url });
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
