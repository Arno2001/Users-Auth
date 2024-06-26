import type { TokenTypeEnum } from "../../../constants";

export interface IAccessTokenPayload {
  userId: Uuid;
  type: TokenTypeEnum;
}
