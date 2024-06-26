import { Injectable } from "@nestjs/common";

import { JwtService } from "../../shared/services/jwt.service";
import { UserNotFoundException } from "../user/exceptions";
import { UserIsAlreadyExistsException } from "../user/exceptions/user-is-already-exists.exception";
import type { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import type { LoginDto } from "./dto/login.dto";
import { LoginPayloadDto } from "./dto/login-payload.dto";
import type { UserRegisterDto } from "./dto/user-register.dto";
import type { IAccessTokenPayload } from "./interfaces/IAccessTokenPayload";
import { validateHash } from "../../common/utils";
import { InvalidPasswordException } from "./exceptions";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(userRegisterDto: UserRegisterDto): Promise<LoginPayloadDto> {
    const isExsistUser = await this.userService.findByEmail(
      userRegisterDto.email
    );

    if (isExsistUser) {
      throw new UserIsAlreadyExistsException();
    }

    const userEntity = await this.userService.create(userRegisterDto);
    const accessToken = this.jwtService.createAccessToken(userEntity);

    return new LoginPayloadDto({
      accessToken,
      user: userEntity.toDto(),
    });
  }

  async login(loginDto: LoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.userService.findByEmail(loginDto.email);

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    const isValidPassword = await validateHash(
      loginDto.password,
      userEntity.password
    );

    if (!isValidPassword) {
      throw new InvalidPasswordException();
    }

    const accessToken = this.jwtService.createAccessToken(userEntity);

    return new LoginPayloadDto({
      accessToken,
      user: userEntity.toDto(),
    });
  }

  async validate(payload: IAccessTokenPayload): Promise<UserEntity | null> {
    return this.userService.findById(payload.userId);
  }
}
