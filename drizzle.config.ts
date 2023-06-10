import { out, schema } from "./src/db";
import type { Config } from "drizzle-kit";

export default { schema, out } satisfies Config;
