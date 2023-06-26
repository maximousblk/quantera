"use client";

import { useEffect, useState } from "react";

import { checkPasskeysSupported, cn } from "@/lib/utils";
import {
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

import { LuComponent, LuFingerprint } from "react-icons/lu";
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
  const [isPasskeysSupported, setPasskeysSupported] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<"login" | "register">("register");
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    (async () => {
      const support = await checkPasskeysSupported();
      setPasskeysSupported(support);

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
  }, []);

  return (
    <main className="flex flex-1 flex-col items-center justify-center space-y-8">
      <div className="flex flex-col space-y-4 text-center">
        <LuComponent className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-bold tracking-tight">{formTabs[currentTab].greeting}</h1>
        <p className="text-sm text-muted-foreground">Passkeys are {isPasskeysSupported ? "supported ✅" : "not supported ❌"}</p>
      </div>
      <Tabs
        defaultValue="register"
        className="w-[24rem]"
        onValueChange={(value) => {
          setCurrentTab(value as "login" | "register");
        }}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value={currentTab}>
          <Card>
            <form>
              <fieldset disabled={!isPasskeysSupported} className="flex flex-col">
                <CardHeader>
                  <legend className="flex flex-col space-y-2">
                    <CardTitle>{formTabs[currentTab].title}</CardTitle>
                    <CardDescription>{formTabs[currentTab].instructions}</CardDescription>
                  </legend>
                </CardHeader>

                <CardContent className="flex flex-col space-y-4">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    type="text"
                    id="nickname"
                    onChange={(e) => {
                      setNickname(e.target.value);
                    }}
                    placeholder="Luke"
                    autoComplete="username webauthn"
                    required
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();

                      formTabs[currentTab]
                        .action({ nickname })
                        .then(daisyLog)
                        .then((verified) => {
                          if (verified) {
                          }
                        });
                    }}
                    className={cn(buttonVariants(), "flex space-x-2")}
                  >
                    <LuFingerprint className="h-5 w-5" />
                    <span>{formTabs[currentTab].title}</span>
                  </button>
                </CardContent>
              </fieldset>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
