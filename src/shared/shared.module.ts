import { Global, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { ApiConfigService } from "./services/api-config.service";
import { JwtService } from "./services/jwt.service";

const providers = [ApiConfigService, JwtService];

@Global()
@Module({
  providers,
  imports: [CqrsModule],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
