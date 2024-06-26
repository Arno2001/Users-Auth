import {
  applyDecorators,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { AuthGuard } from "../guards/auth.guard";
import { AuthUserInterceptor } from "../interceptors/auth-user-interceptor.service";

/**
* Decorator factory function to apply authentication-related decorators to a method.
* @param options Optional object with authentication configuration.
* @returns Method decorator function.
*/
export function Auth(
): MethodDecorator {

  return applyDecorators(
    UseGuards(AuthGuard()),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
  );
}
