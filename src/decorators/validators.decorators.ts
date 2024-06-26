import type { ValidationOptions } from "class-validator";
import { registerDecorator, ValidateIf } from "class-validator";
import _ from "lodash";

/**
 * Decorator factory function to validate that a property value matches password criteria.
 * Uses registerDecorator from class-validator to define a custom validation rule.
 * @param validationOptions Optional validation options.
 * @returns Property decorator function.
 */
export function IsPassword(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      propertyName: propertyName as string,
      name: "isPassword",
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message:
          "Regex requires: 1 digit, 1 lowercase & uppercase letter (a-z or A-Z), 1 alphanumeric, min. 8 characters.",
      },
      validator: {
        validate(value: string) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
            value
          );
        },
      },
    });
  };
}

/**
 * Decorator factory function to validate that a property is not undefined.
 * Uses ValidateIf decorator from class-validator to perform validation.
 * @param options Optional validation options.
 * @returns Property decorator function.
 */
export function IsUndefinable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_obj, value) => value !== undefined, options);
}

/**
 * Decorator factory function to validate that a property is not null.
 * Uses ValidateIf decorator from class-validator to perform validation.
 * @param options Optional validation options.
 * @returns Property decorator function.
 */
export function IsNullable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_obj, value) => value !== null, options);
}
