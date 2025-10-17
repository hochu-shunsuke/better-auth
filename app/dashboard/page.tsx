import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default async function DashboardPage() {
	const session = await auth
		.api.getSession({ headers: await headers() })
		.catch(() => {
			throw redirect("/sign-in");
		});

	return (
		<div className="w-full">
			<div className="flex gap-4 flex-col">
				<div className="p-4">
					<h2 className="text-lg font-medium">Dashboard</h2>
					<p className="text-sm text-muted-foreground">
						Signed in as {session?.user?.email}
					</p>
					<form
						action={async () => {
							await signOut({ fetchOptions: { onSuccess() {} } });
						}}
					>
						<button type="submit" className="mt-4 btn">
							Sign out
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
