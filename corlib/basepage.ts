// corlib/basepage.ts
import dotenv from "dotenv";
dotenv.config();

export const baseURL: string = process.env.BASE_URL || "";

if (!baseURL) {
  throw new Error("BASE_URL is not defined in .env file");
}



