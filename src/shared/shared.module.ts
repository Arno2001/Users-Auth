import { Global, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { ApiConfigService } from "./services/api-config.service";
import { JwtService } from "./services/jwt.service";

/**
 * Global module for shared services and configuration providers.
 * Includes ApiConfigService for environment-based configuration and JwtService for JWT operations.
 * Imports CqrsModule for Command Query Responsibility Segregation (CQRS) support.
 * Exports ApiConfigService, JwtService, and CqrsModule for global availability.
 */
@Global()
@Module({
  providers: [ApiConfigService, JwtService],
  imports: [CqrsModule],
  exports: [ApiConfigService, JwtService, CqrsModule],
})
export class SharedModule {}
