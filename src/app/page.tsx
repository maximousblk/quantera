import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/button";

import { LuCheck, LuHeart } from "react-icons/lu";

import PostgresIcon from "@/assets/pg";
import PasskeysIcon from "@/assets/passkeys";
import DrizzleIcon from "@/assets/drizzle";
import NextjsIcon from "@/assets/nextjs";
import MillionIcon from "@/assets/million";

const REPO = "maximousblk/maximousblk";

async function getGitHubStars(): Promise<string | null> {
  try {
    const res = await fetch("https://api.github.com/repos/" + REPO, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return parseInt(json["stargazers_count"]).toLocaleString();
  } catch (error) {
    return null;
  }
}

const features = [
  {
    title: "Passkeys",
    description: "Passwordless authentication using Passkeys and Webauthn",
    href: "https://passkeys.dev/",
    icon: <PasskeysIcon />,
  },
  {
    title: "Drizzle",
    description: "It's merely a overrated typesafe sql wrapper, not even a query builder",
    href: "https://orm.drizzle.team/",
    icon: <DrizzleIcon />,
  },
  {
    title: "Vercel Storage",
    description: "Serverless Postgres on the edge through Vercel Storage",
    href: "https://vercel.com/storage/postgres",
    icon: <PostgresIcon />,
  },
  {
    title: "shadcn/ui",
    description: "Customizable UI components built using Radix UI and Tailwind CSS",
    href: "https://ui.shadcn.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12">
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    ),
  },
  {
    title: "Next.js 13",
    description: "App Router, React Server Components, Server Actions.",
    href: "https://nextjs.org/",
    icon: <NextjsIcon />,
  },
  {
    title: "Million.js",
    description: "The Virtual DOM Replacement for React. Make React 70% faster.",
    href: "https://million.dev/",
    icon: <MillionIcon />,
  },
];

export default async function Home() {
  const stars = await getGitHubStars();

  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link href={`https://github.com/${REPO}`} className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium" target="_blank">
            Follow along on GitHub
          </Link>
          <h1 className="text-4xl font-bold !leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            An example app made for learning new tech.
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            There were a lot of new tech i wanted to try out so made this app to learn and experiment with them.
          </p>
          <div className="space-x-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              href={`https://github.com/${REPO}`}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
      <section id="features" className="space-y-6 p-8 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            This project is an experiment to see how a modern app, with features like Passkeys auth, drizzle, etc. would work.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {features.map((feature) => (
            <Link
              href={feature.href}
              target="_blank"
              rel="noreferrer"
              key={feature.title}
              className="relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:scale-105"
            >
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                {feature.icon}
                <div className="space-y-2">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="container flex flex-col gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24" id="pricing">
        <div className="flex w-full flex-col gap-4 md:max-w-[58rem]">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">Simple, transparent pricing</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Unlock exclusive perks including access to Discord and Sponsorware.
          </p>
        </div>
        <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
          <div className="grid gap-6">
            <h3 className="text-xl font-bold sm:text-2xl">What&apos;s included</h3>
            <ul className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center">
                <LuCheck className="mr-2 h-4 w-4" />
                <span>Sponsors Badge</span>
              </li>
              <li className="flex items-center">
                <LuCheck className="mr-2 h-4 w-4" />
                <span>Weekly Newsletter</span>
              </li>

              <li className="flex items-center">
                <LuCheck className="mr-2 h-4 w-4" />
                <span>Mention in README</span>
              </li>
              <li className="flex items-center">
                <LuCheck className="mr-2 h-4 w-4" />
                <span>Access to Sponsorware</span>
              </li>
              <li className="flex items-center">
                <LuCheck className="mr-2 h-4 w-4" />
                <span>Access to Discord</span>
              </li>
              <li className="flex items-center">
                <LuCheck className="mr-2 h-4 w-4" />
                <span>Prioritized Issues</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 text-center">
            <div>
              <h4 className="mb-2 text-7xl font-bold">$30</h4>
              <p className="text-sm font-medium text-muted-foreground">Billed Monthly</p>
            </div>
            <Link
              href="https://github.com/sponsors/maximousblk/sponsorships?tier_id=160345"
              className={cn(buttonVariants({ size: "lg" }), "group")}
            >
              <LuHeart className="mr-2 h-5 w-5 text-rose-400 transition-all group-hover:scale-110 dark:text-rose-500" />
              <span>Sponsor</span>
            </Link>
          </div>
        </div>
      </section>
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">Proudly Open Source</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Quantera is open source and powered by open source software. <br /> The code is available on{" "}
            <Link href={`https://github.com/${REPO}`} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              GitHub
            </Link>
            .
          </p>
          {stars && (
            <Link href={`https://github.com/${REPO}`} target="_blank" rel="noreferrer" className="flex">
              <div className="flex h-10 w-10 items-center justify-center space-x-2 rounded-md border border-muted bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5 text-foreground">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-muted border-y-transparent"></div>
                <div className="flex h-10 items-center rounded-md border border-muted bg-muted px-4 font-medium">
                  {stars} stars on GitHub
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
