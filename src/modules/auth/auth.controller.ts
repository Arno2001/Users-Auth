import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { RoleTypeEnum } from "../../constants";
import { Auth, AuthUser } from "../../decorators";
import { UserDto } from "../user/dto/user.dto";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LoginPayloadDto } from "./dto/login-payload.dto";
import { UserRegisterDto } from "./dto/user-register.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: "User successfully created",
    type: LoginPayloadDto,
  })
  async register(
    @Body() userRegisterDto: UserRegisterDto
  ): Promise<LoginPayloadDto> {
    return this.authService.register(userRegisterDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: "User successfully logged",
    type: LoginPayloadDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginPayloadDto> {
    return this.authService.login(loginDto);
  }

  @Get("me")
  @Auth([RoleTypeEnum.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: "Get user by Id",
    type: UserDto,
  })
  async getUser(@AuthUser() user: UserEntity): Promise<UserDto> {
    return this.userService.getUser(user.id);
  }
}
