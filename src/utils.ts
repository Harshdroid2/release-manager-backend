import { configDotenv } from "dotenv";
import { readFileSync } from "fs";
import * as path from 'path';

export const isDebug: boolean = process.env.NODE_ENV == "debug";
export const isDevelopmentMode: boolean = process.env.MODE == "development";

export function getRequiredEnvValue(key: string): string {
    const value: string = process.env[key]!;
    if (!value) {
      throw new Error(`Env config error: missing env.${key}`);
    }
    return value;
}

export const privateKey = readFileSync(
  path.join(process.cwd(), "src/constants/keys/private.key"),
  "utf8"
);


export function getGithubLoginRdirectUrl(): string{
  if(process.env.MODE == "development"){
    return "http://localhost:4000/api/auth/github/callback"
  } else {
    return "https://release-manager/api/auth/github/callback"
  }
}

export const setupEnvFile = () => {
    configDotenv({ path: path.resolve(process.cwd(), ".env.prod") });
};