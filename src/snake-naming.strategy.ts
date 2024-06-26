import type { NamingStrategyInterface } from "typeorm";
import { DefaultNamingStrategy } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  // Converts class name to snake_case for table name.
  tableName(className: string, customName: string): string {
    return customName ? customName : snakeCase(className);
  }

  // Converts property name to snake_case for column name.
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.join("_")) +
      (customName ? customName : snakeCase(propertyName))
    );
  }

  // Converts relation name to snake_case.
  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  // Generates join column name in snake_case.
  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + "_" + referencedColumnName);
  }

  // Generates join table name in snake_case.
  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    _secondPropertyName: string,
  ): string {
    return snakeCase(
      firstTableName +
        "_" +
        firstPropertyName.replace(/\./gi, "_") +
        "_" +
        secondTableName,
    );
  }

  // Generates join table column name in snake_case.
  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(
      tableName + "_" + (columnName ? columnName : propertyName),
    );
  }

  // Generates column name for parent table in class table inheritance in snake_case.
  classTableInheritanceParentColumnName(
    parentTableName: string,
    parentTableIdPropertyName: string,
  ): string {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`);
  }
}
