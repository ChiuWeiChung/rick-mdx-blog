import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FeatureCard from '@/components/feature-card';

export default async function Home() {
	const session = await auth();

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
			<div className="container mx-auto flex flex-col items-center px-4 py-16">
				{/* Hero Section */}
				<section className="mb-16 max-w-3xl text-center">
					<h1 className="mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text pb-1 text-4xl font-bold text-transparent md:text-6xl">
						Rick&apos;s MDX Blog
					</h1>
					<p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
						Exploring technology through beautifully rendered MDX content
					</p>

					{session ? (
						<div className="flex flex-col items-center gap-4">
							<p className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
								<span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
								Signed in as {session.user?.email}
							</p>
							<form
								action={async () => {
									'use server';
									await signOut();
								}}
							>
								<Button variant="outline" type="submit">
									Sign Out
								</Button>
							</form>
						</div>
					) : (
						<Link href="/admin/google-sign-in">
							<Button>Sign In with Google</Button>
						</Link>
					)}
				</section>

				{/* Feature Cards */}
				<section className="mb-16 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
					<FeatureCard
						title="MDX Content"
						description="Beautifully rendered Markdown with JSX"
						content="Explore content with rich formatting, code highlighting, and interactive elements."
						buttonText="View MDX Page"
						href="/mdx-page"
						imageUrl="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop"
					/>

					<FeatureCard
						title="Admin Access"
						description="Secure authentication system"
						content="Login with Google to access administrative features and protected content."
						buttonText="Google Sign In"
						href="/admin/google-sign-in"
						imageUrl="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop"
					/>

					<FeatureCard
						title="Content Editor"
						description="Create and manage content"
						content="Use our powerful MDX editor to create and modify content with real-time preview."
						buttonText="Editor Page"
						href="/admin/editor-page"
						imageUrl="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
					/>
					<FeatureCard
						title="Form Playground"
						description="Play with form"
						content="Use our powerful form to play with form."
						buttonText="Form Playground"
						href="/form-playground"
						imageUrl="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
					/>
				</section>

				{/* Footer */}
				<footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
					<p>© {new Date().getFullYear()} Rick&apos;s MDX Blog. All rights reserved.</p>
				</footer>
			</div>
		</div>
	);
}
