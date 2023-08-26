'use client';

import { useAuth } from '@/hooks';
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default function Home() {
  const { login,error,isAuthenticated,isInvitation } = useAuth();
  if(isAuthenticated)
    return redirect('/profile')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          B2B multi-tenant Platform using Auth0
        </p>

        <div className="relative flex content-center items-center justify-center">
        {error && <span>{error.message}</span>}
          <button
            type="button"
            onClick={login}
            className="rounded bg-indigo-600 px-2 py-1 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isInvitation ? "Accept Invitation" : "Login"}
          </button>
        </div>

        <div className="fixed bottom-0 left-0 flex h-48 w-full gap-2 items-center justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <span>Using</span>
          <a
            className="flex place-items-center lg:p-0"
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
            </a> 
            <a
            className="flex place-items-center lg:p-0"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/next.svg"
              alt="Next Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
          <a
            className="flex place-items-center lg:p-0"
            href="https://auth0.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/auth0.svg"
              alt="Auth0 Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
    </main>
  )
}
