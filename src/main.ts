import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { ExpressAdapter } from "@nestjs/platform-express";
import { middleware as expressCtx } from "express-ctx";

import { AppModule } from "./app.module";
import { setupSwagger } from "./setup-swagger";
import { ApiConfigService } from "./shared/services/api-config.service";
import { SharedModule } from "./shared/shared.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.enableCors();

  // Global validation pipe with custom settings for data transformation and error handling.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );
  // This is middleware for access request and response objects
  app.use(expressCtx); 

  // Retrieve an instance of ApiConfigService from the SharedModule using dependency injection.
  const configService = app.select(SharedModule).get(ApiConfigService);
  setupSwagger(app);

  const port = configService.appConfig.port;
  await app.listen(port);
}

bootstrap();
