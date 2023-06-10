import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const out = ".drizzle";
export const schema = "src/db/schema.ts";

export const db = drizzle(sql);
export default db;
