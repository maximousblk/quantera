import { db, out } from ".";
import { migrate } from "drizzle-orm/postgres-js/migrator";

migrate(db, { migrationsFolder: out });
