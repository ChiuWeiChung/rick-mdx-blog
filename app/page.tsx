import { auth, signOut } from '@/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  console.log('session', session);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mt-2 tracking-[-.01em]">
            <Link href="/mdx-page" className="text-blue-500 hover:underline">
              查看我的 MDX 頁面
            </Link>
          </li>
          <li className="mt-2 tracking-[-.01em]">
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </li>
          <li className="mt-2 tracking-[-.01em]">
            <Link href="/google-sign-in" className="text-blue-500 hover:underline">
              Google Sign In
            </Link>
          </li>
          <li className="mt-2 tracking-[-.01em]">
            <Link href="/editor-page" className="text-blue-500 hover:underline">
              Editor Page
            </Link>
          </li>
        </ol>

        <ol>
          <li>meow</li>
          <li>meow</li>
          <li>meow</li>
        </ol>

        {session && (
          <div>
            <p>User is signed in</p>
            <p>{session.user?.email}</p>
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <button type="submit">Signout</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
