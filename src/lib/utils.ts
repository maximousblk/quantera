import { browserSupportsWebAuthn, browserSupportsWebAuthnAutofill, platformAuthenticatorIsAvailable } from "@simplewebauthn/browser";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function checkPasskeysSupported() {
  return browserSupportsWebAuthn() && (await platformAuthenticatorIsAvailable()) && (await browserSupportsWebAuthnAutofill());
}
