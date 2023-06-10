import "./globals.css";

import type { Metadata } from "next/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MainNav } from "@/components/nav";
import { buttonVariants } from "@/components/button";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Quantera",
    template: "%s - Quantera ",
  },
  description: "A demo app using newest tech in the wild webs.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

const mainNav = [
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "Pricing",
    href: "/#pricing",
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="">
      <body className={cn("flex min-h-screen flex-col bg-background font-sans antialiased", inter.variable)}>
        <header className="container z-40 bg-background">
          <nav>
            <div className="flex h-20 items-center justify-between">
              <MainNav items={mainNav} />
              <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "px-4")}>
                Login
              </Link>
            </div>
          </nav>
        </header>
        <div className="relative flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
