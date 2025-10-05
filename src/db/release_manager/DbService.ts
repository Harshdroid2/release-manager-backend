/*
 * Copyright (c) 2022. FieldAssist
 * All rights reserved.
 */

import { DataSource } from "typeorm";

export abstract class DbService {
  abstract dataSource: DataSource;

  async initialize() {
    try {
      const connection = await this.dataSource.initialize();
      console.info(`✅ Database connection successful: ${connection.options.type}: ${connection.options.database}`);
      return this.dataSource;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  connection(): DataSource {
    return this.dataSource;
  }

  async close() {
    if (!this.dataSource.isInitialized) {
      return;
    }
    await this.dataSource.destroy();
    console.info(`✅ Database connection closed`);
    return this.dataSource;
  }
}
