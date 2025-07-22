import FeatureCard from '@/components/feature-card';
import React from 'react'

export default function LandingDemoPage() {
  return (
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
        href="/auth"
        imageUrl="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop"
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
        title="Highlight Test"
        description="Test highlight"
        content="Test highlight"
        buttonText="Highlight Test"
        href="/highlight-test"
        imageUrl="https://images.unsplash.com/photo-1600492515568-8868f609511e?q=80&w=2450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
    </section>
  );
}
