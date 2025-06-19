import FeatureCard from '@/components/feature-card';

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 shadow-inner dark:from-gray-900 dark:to-gray-950">
			{/* // <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950"> */}
			<div className="container mx-auto flex flex-col items-center px-4 py-16">
				{/* Hero Section */}
				<section className="max-w-3xl text-center">
					<h1 className="mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text pb-1 text-4xl font-bold text-transparent md:text-6xl">
						Stay Hungry, Stay Foolish
					</h1>
					<p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
						探索技術，分享知識，一起成長
					</p>
				</section>

				{/* Feature Cards */}
				<section className="mb-16 grid w-full max-w-5xl grid-cols-1 gap-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
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
						imageUrl="https://images.unsplash.com/photo-1579444741963-5ae219cfe27c?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // new unsplash image
					/>
					<FeatureCard
						title="Image Upload"
						description="Upload image"
						content="Use our powerful image upload to upload image."
						buttonText="Image Upload"
						href="/image-upload"
						// imageUrl="http://localhost:3000/api/image?key=js/card.png"
					/>
				</section>
			</div>
		</div>
	);
}
