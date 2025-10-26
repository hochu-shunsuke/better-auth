import Link from "next/link";
import { headers } from "next/headers";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="bg-white dark:bg-black border-b py-2 fixed top-0 left-0 z-50 w-full">
      <div className="flex justify-between items-center border-border mx-auto w-full max-w-screen-lg px-4 md:px-1">
        <Link href="/">
          <div className="flex gap-2 cursor-pointer">
            <p className="dark:text-white text-black">My App</p>
          </div>
        </Link>
        <div className="z-50 flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={session ? "/dashboard" : "/sign-in"}
            className="flex justify-center"
          >
            <Button className="gap-2  justify-between" variant="default">
              <span>{session ? "Dashboard" : "Sign In"}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
