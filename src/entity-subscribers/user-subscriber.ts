import type { EntitySubscriberInterface, InsertEvent } from "typeorm";
import { EventSubscriber } from "typeorm";

import { generateHash } from "../common/utils";
import { UserEntity } from "../modules/user/user.entity";

/**
 * Event subscriber for UserEntity events.
 * Implements EntitySubscriberInterface to handle database events related to UserEntity.
 */
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  /**
   * Handles logic to execute before inserting a UserEntity into the database.
   * @param event The InsertEvent containing the UserEntity being inserted.
   */
  beforeInsert(event: InsertEvent<UserEntity>): void {
    // Hashes the password before insertion if present
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }
}
