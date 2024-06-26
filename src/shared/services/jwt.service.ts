import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

import { TokenTypeEnum } from "../../constants";
import type { IAccessTokenPayload } from "../../modules/auth/interfaces/IAccessTokenPayload";
import type { UserEntity } from "../../modules/user/user.entity";
import { ApiConfigService } from "./api-config.service";

@Injectable()
export class JwtService {
  readonly jwtPrivateKey: string;

  readonly jwtPublicKey: string;

  readonly expirationTime: string;

  constructor(public apiConfigService: ApiConfigService) {
    this.jwtPrivateKey = apiConfigService.authConfig.privateKey;
    this.jwtPublicKey = apiConfigService.authConfig.publicKey;
    this.expirationTime = apiConfigService.authConfig.expirationTime;
  }

  createAccessToken(userEntity: UserEntity): string {
    const payload: IAccessTokenPayload = {
      userId: userEntity.id,
      type: TokenTypeEnum.ACCESS_TOKEN,
    };
    const options: jwt.SignOptions = {
      algorithm: "RS256",
      expiresIn: this.expirationTime,
    };

    return jwt.sign(payload, this.jwtPrivateKey, options);
  }
}
