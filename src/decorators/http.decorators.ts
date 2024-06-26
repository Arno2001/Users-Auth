import {
  applyDecorators,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import type { RoleTypeEnum } from "src/constants";

import { AuthGuard } from "../guards/auth.guard";
import { AuthUserInterceptor } from "../interceptors/auth-user-interceptor.service";
import { PublicRoute } from "./public-route.decorator";

export function Auth(
  roles: RoleTypeEnum[] = [],
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(AuthGuard({ public: isPublicRoute })),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
    PublicRoute(isPublicRoute),
  );
}
