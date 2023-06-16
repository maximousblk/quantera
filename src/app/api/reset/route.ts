import db from "@/db";
import { Challenge, Credential, User } from "@/db/schema";
import { NextResponse } from "next/server";

const SECRET = process.env.NODE_ENV === "development" ? "development" : process.env.DB_RESET_SECRET!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("key") !== SECRET) return NextResponse.json({ success: false });

  await db.transaction(async (tx) => {
    await tx.delete(Challenge);
    await tx.delete(Credential);
    await tx.delete(User);
  });

  return NextResponse.json({ success: true });
}
