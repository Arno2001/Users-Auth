import { getValue, setValue } from "express-ctx";

import type { UserEntity } from "../modules/user/user.entity";

export class ContextProvider {
  private static readonly nameSpace = "request"; // Namespace for context data
  private static readonly authUserKey = "user_key"; // Key for storing authenticated user


  /**
   * Retrieves a value from the context using a specified key.
   * @param key The key to retrieve the value.
   * @returns The retrieved value or undefined if not found.
   */
  private static get<T>(key: string): T | undefined {
    return getValue<T>(ContextProvider.getKeyWithNamespace(key));
  }

  /**
   * Sets a value in the context using a specified key.
   * @param key The key to set the value.
   * @param value The value to be set.
   */
  private static set(key: string, value: any): void {
    setValue(ContextProvider.getKeyWithNamespace(key), value);
  }

  /**
   * Appends the namespace to a specified key to ensure uniqueness.
   * @param key The key to append with the namespace.
   * @returns The key appended with the namespace.
   */
  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  /**
   * Sets the authenticated user in the context.
   * @param user The authenticated user entity to be set.
   */
  static setAuthUser(user: UserEntity): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

 /**
   * Retrieves the authenticated user from the context.
   * @returns The authenticated user entity.
   */
  static getAuthUser(): UserEntity {
    return ContextProvider.get<UserEntity>(ContextProvider.authUserKey);
  }
}
