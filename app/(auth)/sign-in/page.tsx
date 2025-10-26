"use client";

import SignIn from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { Tabs } from "@/components/ui/tabs2";
import { client } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const { data: session } = client.useSession();
	const router = useRouter();

	useEffect(() => {
		if (session) {
			router.push("/dashboard");
		}
	}, [session, router]);

	return (
		<div className="w-full">
			<div className="flex items-center flex-col justify-center w-full md:py-10">
				<div className="md:w-[400px]">
					<Tabs
						tabs={[
							{
								title: "Sign In",
								value: "sign-in",
								content: <SignIn />,
							},
							{
								title: "Sign Up",
								value: "sign-up",
								content: <SignUp />,
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}
