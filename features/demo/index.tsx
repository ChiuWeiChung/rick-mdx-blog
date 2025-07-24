import FeatureCard from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function LandingDemoPage() {
  return (
    <section className="mb-16 grid w-full max-w-5xl grid-cols-1 gap-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      <FeatureCard
        title="MDX Content"
        description="Beautifully rendered Markdown with JSX"
        content="Explore content with rich formatting, code highlighting, and interactive elements."
        footer={
          <Link href="/mdx-page">
            <Button>View MDX Page</Button>
          </Link>
        }
        imageUrl="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop"
      />

      <FeatureCard
        title="Admin Access"
        description="Secure authentication system"
        content="Login with Google to access administrative features and protected content."
        footer={
          <Link href="/auth">
            <Button>Google Sign In</Button>
          </Link>
        }
        imageUrl="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop"
      />

      <FeatureCard
        title="Form Playground"
        description="Play with form"
        content="Use our powerful form to play with form."
        footer={
          <Link href="/form-playground">
            <Button>Form Playground</Button>
          </Link>
        }
        imageUrl="https://images.unsplash.com/photo-1579444741963-5ae219cfe27c?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // new unsplash image
      />
      <FeatureCard
        title="Highlight Test"
        description="Test highlight"
        content="Test highlight"
        footer={
          <Link href="/highlight-test">
            <Button>Highlight Test</Button>
          </Link>
        }
        imageUrl="https://images.unsplash.com/photo-1600492515568-8868f609511e?q=80&w=2450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
    </section>
  );
}
