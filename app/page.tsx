import { SignInButton, SignInFallback } from "@/components/sign-in-btn";
import { Suspense } from "react";

const features = [
	{
		name: "Email & Password",
		link: "https://www.better-auth.com/docs/authentication/email-password",
	},
	{
		name: "Organization | Teams",
		link: "https://www.better-auth.com/docs/plugins/organization",
	},
	{
		// Passkeys removed for minimal demo
	},
	{
		// Multi Factor removed for minimal demo
	},
	{
		name: "Password Reset",
		link: "https://www.better-auth.com/docs/authentication/email-password#request-password-reset",
	},
	{
		name: "Email Verification",
		link: "https://www.better-auth.com/docs/authentication/email-password#email-verification",
	},
	{
		name: "Roles & Permissions",
		link: "https://www.better-auth.com/docs/plugins/organization#roles",
	},
	{
		name: "Rate Limiting",
		link: "https://www.better-auth.com/docs/reference/security#rate-limiting",
	},
	{
		name: "Session Management",
		link: "https://www.better-auth.com/docs/concepts/session-management",
	},
];

export default async function Home() {
	return (
		<div className="min-h-[80vh] flex items-center justify-center overflow-hidden no-visible-scrollbar px-6 md:px-0">
			<main className="flex flex-col gap-4 row-start-2 items-center justify-center">
				<div className="flex flex-col gap-1">
					<h3 className="font-bold text-4xl text-black dark:text-white text-center">
						Better Auth.
					</h3>
					<p className="text-center break-words text-sm md:text-base">
						Official demo to showcase{" "}
						<a
							href="https://better-auth.com"
							target="_blank"
							className="italic underline"
						>
							better-auth.
						</a>{" "}
						features and capabilities. <br />
					</p>
				</div>
				<div className="md:w-10/12 w-full flex flex-col gap-4">
					<div className="flex flex-col gap-3 pt-2 flex-wrap">
						<div className="border-y py-2 border-dotted bg-secondary/60 opacity-80">
							<div className="text-xs flex items-center gap-2 justify-center text-muted-foreground ">
								<span className="text-center">
									All features on this demo are implemented with Better Auth
									without any custom backend code
								</span>
							</div>
						</div>
						<div className="flex gap-2 justify-center flex-wrap">
									{features.map((feature, idx) => (
								<a
									className="border-b pb-1 text-muted-foreground text-xs cursor-pointer hover:text-foreground duration-150 ease-in-out transition-all hover:border-foreground flex items-center gap-1"
									key={feature.name ?? `feature-${idx}`}
									href={feature.link ?? "#"}
								>
									{feature.name ?? `Feature ${idx + 1}`}
								</a>
							))}
						</div>
					</div>
					{/* @ts-ignore */}
					<Suspense fallback={<SignInFallback />}>
						{/* @ts-ignore */}
						<SignInButton />
					</Suspense>
				</div>
				<a href="https://github.com/hochu-shunsuke/better-auth" target="_blank" rel="noopener noreferrer">
						<img src="https://gh-card.dev/repos/hochu-shunsuke/better-auth.svg?fullname=" alt="GitHub Repo Card" style={{ display: "block", margin: "0 auto" }} width={400} />
				</a>
			</main>
		</div>
	);
}
