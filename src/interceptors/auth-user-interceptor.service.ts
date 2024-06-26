import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from "@nestjs/common";
import { Injectable } from "@nestjs/common";

import type { UserEntity } from "../modules/user/user.entity";
import { ContextProvider } from "../providers";

/**
 * Interceptor to set the authenticated user in the request context.
 * Implements NestInterceptor to intercept and modify incoming requests.
 */
@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    // Extracts the HTTP request from the context
    const request = context.switchToHttp().getRequest();

    // Retrieves the authenticated user from the request context
    const user = <UserEntity>request.user;
    
    // Sets the authenticated user in a context provider (example: ContextProvider)
    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
