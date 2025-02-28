import Image from 'next/image'
import Link from 'next/link'

import { LogIn } from 'lucide-react'

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-12 row-start-2 items-center sm:items-start'>
        <Image
          src='/poop-emoji.png'
          alt='Poop emoji'
          width={200}
          height={200}
          className='mx-auto'
        />
        <div id='copy' className='text-center sm:text-left flex flex-col gap-2'>
          <h1 className='text-4xl sm:text-5xl'>
            Welcome to the <span className='text-primary font-bold'>Poop</span>{' '}
            app!
          </h1>
          <p className='sm:text-lg'>
            Track your bowel movements and compete with your friends.
          </p>
        </div>

        <div className='flex gap-4 sm:gap-8 w-full items-center justify-center flex-col sm:flex-row'>
          <Link
            className='rounded-2xl w-full sm:w-48 transition-transform flex items-center justify-center bg-primary text-foreground gap-2 hover:scale-105 text-base h-10 sm:h-12 px-4 sm:px-5'
            href={`/register`}
          >
            Sign up
          </Link>
          <Link
            className='rounded-2xl w-full sm:w-48 transition-transform flex items-center justify-center bg-foreground text-background gap-2 hover:scale-105 text-base h-10 sm:h-12 px-4 sm:px-5'
            href={`/login`}
          >
            <LogIn size={20} className='mr-1' />
            Login
          </Link>
        </div>
      </main>
    </div>
  )
}
