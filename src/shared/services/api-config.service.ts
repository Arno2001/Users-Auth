import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { isNil } from "lodash";

import { UserSubscriber } from "../../entity-subscribers/user-subscriber";
import { SnakeNamingStrategy } from "../../snake-naming.strategy";

@Injectable()
export class ApiConfigService {
  constructor(private nestConfigService: NestConfigService) {}

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + " environment variable is not a number");
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + " env var is not a boolean");
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, "\n");
  }

  get nodeEnv(): string {
    return this.getString("NODE_ENV");
  }

  get postgresConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + "/../../modules/**/*.entity{.ts,.js}"];
    let migrations = [__dirname + "/../../database/migrations/*{.ts,.js}"];

    if (module.hot) {
      const entityContext = require.context(
        "./../../modules",
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext(id) as Record<string, unknown>;
        const [entity] = Object.values(entityModule);

        return entity as string;
      });
      const migrationContext = require.context(
        "./../../database/migrations",
        false,
        /\.ts$/,
      );

      migrations = migrationContext.keys().map((id) => {
        const migrationModule = migrationContext(id) as Record<string, unknown>;
        const [migration] = Object.values(migrationModule);

        return migration as string;
      });
    }

    return {
      entities,
      migrations,
      type: "postgres",
      host: this.getString("DB_HOST"),
      port: this.getNumber("DB_PORT"),
      username: this.getString("DB_USERNAME"),
      password: this.getString("DB_PASSWORD"),
      database: this.getString("DB_DATABASE"),
      subscribers: [UserSubscriber],
      migrationsRun: true,
      logging: this.getBoolean("ENABLE_ORM_LOGS"),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString("JWT_PRIVATE_KEY"),
      publicKey: this.getString("JWT_PUBLIC_KEY"),
      expirationTime: this.getString("JWT_EXPIRATION_TIME"),
    };
  }

  get appConfig() {
    return {
      port: this.getString("PORT"),
    };
  }

  private get(key: string): string {
    const value = this.nestConfigService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + " environment variable does not set"); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
