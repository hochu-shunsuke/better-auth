import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { SignInButton } from "./sign-in-btn";

export default async function Navbar() {
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
          <SignInButton />
        </div>
      </div>
    </div>
  );
}
