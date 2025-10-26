
import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="bg-white dark:bg-black border-b py-2 fixed top-0 left-0 z-50 w-full">
      <div className="flex justify-between items-center border-border mx-auto w-full max-w-screen-lg px-4 md:px-1">
        <Link href="/">
          <div className="flex gap-2 cursor-pointer">
            <Logo />
            <p className="dark:text-white text-black">BETTER-AUTH.</p>
          </div>
        </Link>
        <div className="z-50 flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={session?.session ? "/dashboard" : "/sign-in"}
            className="flex justify-center"
          >
            <Button className="gap-2  justify-between" variant="default">
              {!session?.session ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 3H3v4h2V5h14v14H5v-2H3v4h18V3zm12 8h-2V9h-2V7h-2v2h2v2H3v2h10v2h-2v2h2v-2h2v-2h2z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                >
                  <path fill="currentColor" d="M2 3h20v18H2zm18 16V7H4v12z"></path>
                </svg>
              )}
              <span>{session?.session ? "Dashboard" : "Sign In"}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
