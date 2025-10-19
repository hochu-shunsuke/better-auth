import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/sign-out-button";

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
					<SignOutButton />
						<ul style={{ marginTop: 24 }}>
							<li>
								<a href="/client-test/posts_private" style={{ color: '#2563eb', textDecoration: 'underline' }}>
									posts_private へ
								</a>
							</li>
							<li>
								<a href="/client-test/posts_public" style={{ color: '#2563eb', textDecoration: 'underline' }}>
									posts_public へ
								</a>
							</li>
							<li>
								<a href="/api/auth/jwt" style={{ color: '#2563eb', textDecoration: 'underline' }}>
									jwt取得
								</a>
							</li>
						</ul>
				</div>
			</div>
		</div>
	);
}
