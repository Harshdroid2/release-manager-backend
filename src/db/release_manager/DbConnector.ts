/*
 * Copyright (c) 2022. FieldAssist
 * All rights reserved.
 */

import { INestApplication } from "@nestjs/common";
import Container from "typedi";
import { MainDbService } from "./MainDbService";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const initDbConnection = async (
  app: INestApplication,
  onError: (e: any) => void,
  next: () => Promise<void>
): Promise<void> => {
  try {
    await app.get(MainDbService).initialize();

    await next();
  } catch (e) {
    console.error(e);
    onError(e);
  }
};

export const closeDbConnection = async (): Promise<void> => {
  try {
    await Container.get(MainDbService).close();
  } catch (e) {
    console.error(e);
    throw e;
  }
};
