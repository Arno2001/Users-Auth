import { EmailField, PasswordField } from "../../../decorators";

export class LoginDto {
  @EmailField()
  email: string;

  @PasswordField({ minLength: 8 })
  password: string;
}
