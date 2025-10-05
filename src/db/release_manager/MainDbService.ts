/*
 * Copyright (c) 2022. FieldAssist
 * All rights reserved.
 */
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { DbService } from "./DbService";
import { Injectable } from "@nestjs/common";
import { join } from "path";
import { getRequiredEnvValue } from "src/utils";
import { setupEnvFile } from "src/utils";

setupEnvFile();

@Injectable()
export class MainDbService extends DbService {
  dataSource = dataSource;

  async initialize(): Promise<DataSource> {
    const maxRetries = 3;
    const retryDelay = 2 * 1000; // 2 seconds
    if (!this.dataSource.isInitialized) {
      return await this.retry(
        () => this.dataSource.initialize(),
        maxRetries,
        retryDelay,
        getRequiredEnvValue("POSTGRES_DATABASE")
      );
    }
    return this.dataSource;
  }

  async retry<T>(
    operation: () => Promise<T>,
    retries: number,
    delay: number,
    database: string
  ): Promise<T> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await operation();
      } catch (e: any) {
        if (e.message?.toLowerCase()?.includes("fail") || e.message?.toLowerCase()?.includes("err")) {
          console.error(e);
          attempt++;
          if (attempt < retries) {
            console.log(`Retrying ${database} database connection (${attempt}/${retries})...`);
            await new Promise((res) => setTimeout(res, delay));
          } else {
            throw new Error(`${database} database connection failed after maximum retries`);
          }
        } else {
          throw e;
        }
      }
    }
    throw new Error("Unexpected error in retryOperation");
  }

  public getRepository<T extends ObjectLiteral>(target: EntityTarget<T>): Repository<T> {
    return this.connection().getRepository<T>(target);
  }

  /**
   * Check if request id of corresponding entity target exist in database.
   * Throws {@link RequestAlreadyExistHttpError} if at-least one request id is found.
   * @param companyId
   * @param reqId
   * @param target
   */
  public async isRequestAlreadyExist<T>(companyId: number, reqId: string, target: any): Promise<boolean> {
    const result = await this.connection()
      .getRepository(target)
      .findOne({
        where: {
          companyId,
          requestId: reqId,
        },
      });
    if (result) {
      return true;
    }
    return false;
  }
}

export const dataSource = new DataSource({
  type: "postgres",
  host: getRequiredEnvValue("POSTGRES_HOST"),
  port: parseInt(getRequiredEnvValue("POSTGRES_PORT")),
  username: getRequiredEnvValue("POSTGRES_USER"),
  password: getRequiredEnvValue("POSTGRES_PASSWORD"),
  database: getRequiredEnvValue("POSTGRES_DATABASE"),
  entities: [join(__dirname, "entity", "*.{ts,js}")],
  migrations: [join(__dirname, "migration", "*.{ts,js}")],
  subscribers: [join(__dirname, "subscriber", "*.{ts,js}")],
  synchronize: false,
  logging: false,
  ssl: false,
  extra: {
    idleTimeoutMillis: 30000, // 30 seconds
    max: 20, // Maximum number of connections in the pool
    min: 5, // Minimum number of connections in the pool
    connectionTimeoutMillis: 30000, // 30 seconds  acquireTimeout
    application_name: "fa_nestjs_dms_server",
    acquireTimeoutMillis: 30000, // 30 seconds
    createTimeoutMillis: 5000, // 5 seconds
    destroyTimeoutMillis: 5000, // 5 seconds
    reapIntervalMillis: 1000, // 1 second
    createRetryIntervalMillis: 100, // 0.1 seconds
  },
});