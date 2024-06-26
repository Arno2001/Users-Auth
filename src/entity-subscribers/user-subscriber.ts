import type { EntitySubscriberInterface, InsertEvent } from "typeorm";
import { EventSubscriber } from "typeorm";

import { generateHash } from "../common/utils";
import { UserEntity } from "../modules/user/user.entity";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }
}