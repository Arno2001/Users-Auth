import { applyDecorators } from "@nestjs/common";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  NotEquals,
} from "class-validator";
import _ from "lodash";

import { ToLowerCase, ToUpperCase, Trim } from "./transform.decorators";
import { IsNullable, IsPassword, IsUndefinable } from "./validators.decorators";

interface INumberFieldDecorator {
  each?: boolean;
  min?: number;
  max?: number;
  int?: boolean;
  isPositive?: boolean;
  swagger?: boolean;
  maxSize?: number;
  minSize?: number;
}

interface IStringFieldDecorator {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  swagger?: boolean;
  maxSize?: number;
  minSize?: number;
  each?: boolean;
  skipTrim?: boolean;
}

export function StringField(
  options: Omit<ApiPropertyOptions, "type"> & IStringFieldDecorator = {},
): PropertyDecorator {
  const decorators = [IsString({ each: options.each })];

  if (!options.skipTrim) {
    decorators.push(Trim());
  }

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, ...options, isArray: options.each }),
    );
  }

  if (options.minLength) {
    decorators.push(MinLength(options.minLength, { each: options.each }));
  }

  if (options.maxLength) {
    decorators.push(MaxLength(options.maxLength, { each: options.each }));
  }

  if (options.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  if (options.maxSize && options.each) {
    decorators.push(ArrayMaxSize(options.maxSize));
  }

  if (options.minSize && options.each) {
    decorators.push(ArrayMinSize(options.minSize));
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: Omit<ApiPropertyOptions, "type" | "required"> &
    IStringFieldDecorator & { nullable?: boolean } = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    StringField({ required: false, ...options }),
  );
}

export function PasswordField(
  options: Omit<ApiPropertyOptions, "type" | "minLength"> &
    IStringFieldDecorator = {},
): PropertyDecorator {
  const decorators = [
    StringField({ format: "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$", ...options }),
    IsPassword(),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function PasswordFieldOptional(
  options: Omit<ApiPropertyOptions, "type" | "required" | "minLength"> &
    IStringFieldDecorator & { nullable?: boolean } = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    // PasswordField({ required: false, ...options }),
  );
}

export function EmailField(
  options: Omit<ApiPropertyOptions, "type"> & IStringFieldDecorator = {},
): PropertyDecorator {
  const decorators = [
    IsEmail(),
    StringField({ toLowerCase: true, ...options }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function EmailFieldOptional(
  options: Omit<ApiPropertyOptions, "type"> &
    IStringFieldDecorator & { nullable?: boolean } = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    EmailField({ required: false, ...options }),
  );
}
