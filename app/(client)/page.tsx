import LandingBackground from '@/components/landing-background';
import LandingDemoPage from '@/features/demo';

export default function Home() {
  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 shadow-inner dark:from-gray-900 dark:to-gray-950">
      <LandingBackground />
      <div className="container mx-auto flex flex-col items-center px-4 py-16">
        {/* Hero Section */}
        <section className="max-w-3xl text-center">
          <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text pb-1 text-4xl font-bold text-transparent md:text-6xl">
            Stay Hungry, Stay Foolish
          </h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            紀錄開發過程：踩坑、學習與成長
          </p>
        </section>

        {/* Feature Cards */}
        <LandingDemoPage />
      </div>
    </div>
  );
}
