import { Column, Entity } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators/use-dto.decorator";
import { UserDto } from "./dto/user.dto";

@Entity({ name: "users" })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ type: "varchar" })
  firstName: string;

  @Column({ type: "varchar" })
  lastName: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  password: string;
}
