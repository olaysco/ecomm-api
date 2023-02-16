import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ?? "3000";
export const BASE_URL = process.env.BASE_URL ?? "localhost";
export const DB_URI = process.env.DB_URI ?? "";
