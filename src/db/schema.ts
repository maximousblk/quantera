import { pgTable, text, integer, jsonb, timestamp, customType } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

const bytea = customType<{ data: Uint8Array; driverData: string }>({
  dataType() {
    return "text";
  },
  toDriver(value: Uint8Array): string {
    return Buffer.from(value).toString("base64url");
  },
  fromDriver(value: string): Uint8Array {
    return new Uint8Array(Buffer.from(value, "base64url"));
  },
});

export const User = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  data: text("data"),
});

export const UserRelations = relations(User, ({ many }) => ({
  credentials: many(Credential),
}));

export const Credential = pgTable("credentials", {
  credentialID: bytea("id").primaryKey(),
  credentialPublicKey: bytea("public_key").notNull(),
  counter: integer("counter").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => User.id),
});

export const CredentialRelations = relations(Credential, ({ one }) => ({
  user: one(User, { fields: [Credential.userId], references: [User.id] }),
}));

export const Challenge = pgTable("challenges", {
  challenge: text("challenge").primaryKey(),
  timeout: integer("timeout")
    .notNull()
    .default(sql`extract(epoch from now()) + 60 * 5`),
});
