import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import type { Constructor } from "../types";
import type { AbstractDto } from "./dto/abstract.dto";

export interface IAbstractEntity<DTO extends AbstractDto, O = never> {
  id: Uuid;
  createdAt: Date;
  updatedAt: Date;

  toDto(options?: O): DTO;
}

export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O = never,
> implements IAbstractEntity<DTO, O>
{
  @PrimaryGeneratedColumn("uuid")
  id: Uuid;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt: Date;

  private dtoClass: Constructor<DTO, [AbstractEntity, O?]>;
  
  /**
   * Converts the entity to a DTO (Data Transfer Object).
   * Throws an error if @UseDto decorator is not applied to the class.
   * @param options Optional options for DTO initialization.
   * @returns An instance of DTO representing the entity.
   */
  toDto(options?: O): DTO {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new this.dtoClass(this, options);
  }
}
