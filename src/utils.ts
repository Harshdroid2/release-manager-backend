import { configDotenv } from "dotenv";
import path from "path";

export function getRequiredEnvValue(key: string): string {
    const value: string = process.env[key]!;
    if (!value) {
      throw new Error(`Env config error: missing env.${key}`);
    }
    return value;
}

export const setupEnvFile = () => {
    configDotenv({ path: path.resolve(process.cwd(), ".env.beta") });
};