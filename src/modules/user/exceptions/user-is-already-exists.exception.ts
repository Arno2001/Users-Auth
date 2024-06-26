import { ConflictException } from "@nestjs/common";

export class UserIsAlreadyExistsException extends ConflictException {
  constructor() {
    super("This email is already registered");
  }
}
