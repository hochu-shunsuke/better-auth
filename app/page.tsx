
export default async function Home() {
	return (
		<div className="min-h-[80vh] flex items-center justify-center overflow-hidden no-visible-scrollbar px-6 md:px-0">
			<main className="flex flex-col gap-4 row-start-2 items-center justify-center">
				<div className="md:w-10/12 w-full flex flex-col gap-4">
					{/* ログインボタンはNavbarに移動済み */}
				</div>
				<a href="https://github.com/hochu-shunsuke/better-auth" target="_blank" rel="noopener noreferrer">
					<img src="https://gh-card.dev/repos/hochu-shunsuke/better-auth.svg?fullname=" alt="GitHub Repo Card" style={{ display: "block", margin: "0 auto" }} width={400} />
				</a>
			</main>
		</div>
	);
}
