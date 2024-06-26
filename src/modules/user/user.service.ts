import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleTypeEnum } from "src/constants";
import { Repository } from "typeorm";

import type { UserRegisterDto } from "../auth/dto/user-register.dto";
import type { UserDto } from "./dto/user.dto";
import { UserNotFoundException } from "./exceptions";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.userRepository.create({
      ...userRegisterDto,
      role: RoleTypeEnum.USER,
    });
    await this.userRepository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder("users")
      .where("users.email = :email", {
        email,
      });

    return queryBuilder.getOne();
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const userEntity = await this.userRepository
      .createQueryBuilder("users")
      .where("users.id = :userId", { userId })
      .getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async findById(userId: Uuid): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder("users")
      .where("users.id = :userId", { userId })
      .getOne();
  }
}
