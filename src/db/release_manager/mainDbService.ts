/*
 * Copyright (c) 2022. FieldAssist
 * All rights reserved.
 */
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { getRequiredEnvValue } from "src/utils";
import { setupEnvFile } from "src/utils";
setupEnvFile();

@Injectable()
export class MainDbService{
  constructor(
    private dataSource: DataSource
  ) {}

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


  connection(): DataSource {
    return this.dataSource;
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

public async retry<T>(
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
  
}


