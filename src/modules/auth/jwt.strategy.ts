import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { TokenTypeEnum } from "../../constants";
import { ApiConfigService } from "../../shared/services/api-config.service";
import type { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  /**
   * Validates and retrieves user entity based on JWT payload.
   * @param args The JWT payload containing userId and token type.
   * @returns The user entity associated with the validated token.
   * @throws UnauthorizedException if token type is not TokenTypeEnum.ACCESS_TOKEN or user is not found.
   */
  async validate(args: {
    userId: Uuid;
    type: TokenTypeEnum;
  }): Promise<UserEntity> {
    if (args.type !== TokenTypeEnum.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(args.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
