import { EmailField, PasswordField, StringField } from "../../../decorators";

export class UserRegisterDto {
  @StringField()
  firstName: string;

  @StringField()
  lastName: string;

  @EmailField()
  email: string;

  @PasswordField({ minLength: 8 })
  password: string;
}
