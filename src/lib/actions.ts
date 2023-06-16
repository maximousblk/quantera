"use server";

import db from "@/db";
import { Challenge, User, Credential } from "@/db/schema";
import { cookies } from "next/headers";
import * as SimpleWebAuthnServer from "@simplewebauthn/server";
import type * as SimpleWebAuthnTypes from "@simplewebauthn/typescript-types";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";

const RP_NAME = "Quantera";
const RP_ID = (process.env.VERCEL_ENV === "production" ? "quantera.maximousblk.me" : process.env.VERCEL_URL) || "localhost";
const SECRET = new TextEncoder().encode(process.env.NODE_ENV === "production" ? process.env.JWT_SECRET! : "development");

function generateJWT(userId: string) {
  return new SignJWT({ userId }).setProtectedHeader({ alg: "HS256" }).sign(SECRET);
}

function verifyJWT(token: string) {
  return jwtVerify(token, SECRET);
}

function generateRandomID() {
  const id = crypto.getRandomValues(new Uint8Array(32));
  return Buffer.from(id).toString("base64url");
}

export async function generateRegistrationOptions({ nickname }: { nickname: string }) {
  const userID = generateRandomID();

  const options = SimpleWebAuthnServer.generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID,
    userName: nickname,
    userDisplayName: nickname,
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required",
      // authenticatorAttachment: "platform",
    },
  });

  await db.insert(Challenge).values({ challenge: options.challenge });

  cookies().set({
    name: "userID",
    value: userID,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 5 * 60,
  });

  return options;
}

export async function verifyRegistrationResponse({
  nickname,
  credential,
}: {
  nickname: string;
  credential: SimpleWebAuthnTypes.RegistrationResponseJSON;
}) {
  const userId = cookies().get("userID");
  console.log({ userID: userId });
  if (!userId) throw new Error("No userID cookie");

  const clientData = JSON.parse(atob(credential.response.clientDataJSON));
  console.log({ clientData });
  if (!clientData.challenge) throw new Error("No challenge in clientData");

  const challenge = await db.select().from(Challenge).where(eq(Challenge.challenge, clientData.challenge)).limit(1);
  console.log({ challenge });
  if (!challenge.length || challenge[0].timeout < Date.now() / 1000) throw new Error("Challenge expired");

  const verification = await SimpleWebAuthnServer.verifyRegistrationResponse({
    response: credential,
    expectedChallenge: clientData.challenge,
    expectedRPID: RP_ID,
    expectedOrigin: RP_ID === "localhost" ? "http://localhost:3000" : `https://${RP_ID}`,
    requireUserVerification: true,
  });
  console.log({ verification });
  if (!verification.verified || !verification.registrationInfo) throw new Error("Verification failed");

  const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

  await db.delete(Challenge).where(eq(Challenge.challenge, clientData.challenge));

  await db.transaction(async (tx) => {
    await tx.insert(User).values({ id: userId.value, name: nickname, data: `Hello, ${nickname}!` });
    await tx.insert(Credential).values({ credentialID, credentialPublicKey, counter, userId: userId.value });
  });

  cookies().set({
    name: "token",
    value: await generateJWT(userId.value),
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 5 * 60,
  });

  return verification.verified;
}

export async function generateAuthenticationOptions() {
  const options = SimpleWebAuthnServer.generateAuthenticationOptions({
    rpID: RP_ID,
    userVerification: "required",
  });

  await db.insert(Challenge).values({ challenge: options.challenge });

  return options;
}

export async function verifyAuthenticationResponse({ credential }: { credential: SimpleWebAuthnTypes.AuthenticationResponseJSON }) {
  const clientData = JSON.parse(atob(credential.response.clientDataJSON));
  console.log({ clientData });
  if (!clientData.challenge) throw new Error("No challenge in clientData");

  const challenge = await db.select().from(Challenge).where(eq(Challenge.challenge, clientData.challenge)).limit(1);
  console.log({ challenge });
  if (!challenge.length || challenge[0].timeout < Date.now() / 1000) throw new Error("Challenge expired");

  const userId = credential.response.userHandle;
  console.log({ userId });
  if (!userId) throw new Error("No userHandle in credential");

  const user = await db.select().from(User).where(eq(User.id, userId)).limit(1);
  console.log({ user });
  if (!user.length) throw new Error("User not found");

  const allUserCredentials = await db.select().from(Credential).where(eq(Credential.userId, userId));
  console.log({ credentials: allUserCredentials });
  if (!allUserCredentials.length) throw new Error("No credentials for user");

  const usedCredential = allUserCredentials.find((c) => Buffer.from(c.credentialID).toString("base64url") === credential.id);
  console.log({ usedCredential });
  if (!usedCredential) throw new Error("Credential not found");

  const verification = await SimpleWebAuthnServer.verifyAuthenticationResponse({
    response: credential,
    expectedChallenge: clientData.challenge,
    expectedOrigin: "http://localhost:3000",
    expectedRPID: "localhost",
    authenticator: usedCredential,
  });
  console.log({ verification });
  if (!verification.verified) throw new Error("Verification failed");

  await db.delete(Challenge).where(eq(Challenge.challenge, clientData.challenge));

  await db
    .update(Credential)
    .set({ counter: verification.authenticationInfo.newCounter })
    .where(eq(Credential.credentialID, usedCredential.credentialID));

  cookies().set({
    name: "token",
    value: await generateJWT(userId),
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 5 * 60,
  });

  return verification.verified;
}
