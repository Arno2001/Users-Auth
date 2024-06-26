import { compare, hashSync } from "bcrypt";

import type { Optional } from "../types";

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: Optional<string>,
  hash: Optional<string>,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return compare(password, hash);
}
