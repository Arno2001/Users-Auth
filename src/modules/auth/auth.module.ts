import { forwardRef, Module } from "@nestjs/common";

import { SharedModule } from "../../shared/shared.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => SharedModule)],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
