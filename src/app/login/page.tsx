"use client";

import { useSignal, useSignalEffect } from "@preact/signals-react";
import { useRouter } from "next/navigation";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import {
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
  browserSupportsWebAuthnAutofill,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@/lib/actions";

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { buttonVariants } from "@/components/button";
import { Label } from "@/components/label";
import { Input } from "@/components/input";

import { LuComponent } from "react-icons/lu";
import { Verified } from "lucide-react";

function daisyLog<T>(params: T) {
  console.log(params);
  return params;
}

async function handleRegistration({ nickname }: { nickname: string }) {
  return await generateRegistrationOptions({ nickname })
    .then(daisyLog)
    .then(startRegistration)
    .then(daisyLog)
    .then((credential) => verifyRegistrationResponse({ nickname, credential }))
    .then(daisyLog)
    .catch(console.error);
}

async function handleAuthentication() {
  return await generateAuthenticationOptions()
    .then(daisyLog)
    .then(startAuthentication)
    .then(daisyLog)
    .then((credential) => verifyAuthenticationResponse({ credential }))
    .then(daisyLog)
    .catch(console.error);
}

const formTabs = {
  login: {
    greeting: "Welcome back! 👋",
    instructions: "Select a passkey to login",
    title: "Login",
    action: handleAuthentication,
  },
  register: {
    greeting: "Let's get you started! 🚀",
    instructions: "Choose a nickname for your new account",
    title: "Register",
    action: handleRegistration,
  },
};

export default function Login() {
  const router = useRouter();

  const isPasskeysSupported = useSignal<boolean>(false);
  const currentTab = useSignal<"login" | "register">("register");
  const nickname = useSignal<string>("");

  useSignalEffect(() => {
    (async () => {
      const support = browserSupportsWebAuthn() && (await platformAuthenticatorIsAvailable()) && (await browserSupportsWebAuthnAutofill());
      isPasskeysSupported.value = support;

      if (support) {
        console.log("Passkeys are supported");

        generateAuthenticationOptions()
          .then(daisyLog)
          .then((options) => startAuthentication(options, true))
          .then(daisyLog)
          .then((credential) => verifyAuthenticationResponse({ credential }))
          .then(daisyLog)
          .catch(console.error);

        console.log("Started authentication");
      }
    })();
  });

  return (
    <main className="flex flex-1 flex-col items-center justify-center space-y-8">
      <div className="flex flex-col space-y-4 text-center">
        <LuComponent className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-bold tracking-tight">{formTabs[currentTab.value].greeting}</h1>
        <p className="text-sm text-muted-foreground">Passkeys are {isPasskeysSupported.value ? "supported ✅" : "not supported ❌"}</p>
      </div>
      <Tabs
        defaultValue="register"
        className="w-[24rem]"
        onValueChange={(value) => {
          currentTab.value = value as any;
        }}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value={currentTab.value}>
          <Card>
            <form>
              <fieldset disabled={!isPasskeysSupported} className="flex flex-col">
                <CardHeader>
                  <legend className="flex flex-col space-y-2">
                    <CardTitle>{formTabs[currentTab.value].title}</CardTitle>
                    <CardDescription>{formTabs[currentTab.value].instructions}</CardDescription>
                  </legend>
                </CardHeader>

                <CardContent className="flex flex-col space-y-4">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    type="email"
                    id="nickname"
                    onChange={(e) => {
                      nickname.value = e.target.value;
                    }}
                    placeholder="Luke"
                    autoComplete="username webauthn"
                    required
                  />

                  <input
                    type="button"
                    onClick={() => {
                      formTabs[currentTab.value]
                        .action({ nickname: nickname.value })
                        .then(daisyLog)
                        .then((verified) => {
                          if (verified) {
                            router.refresh();
                          }
                        });
                    }}
                    value={formTabs[currentTab.value].title}
                    className={buttonVariants()}
                  />
                </CardContent>
              </fieldset>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
