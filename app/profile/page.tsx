'use client'

import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'

export default function Profile() {
  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const router = useRouter()

  const handleLogOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <main className='p-6'>
        <section
          id='userInfo'
          className='my-14 flex flex-col items-start justify-start gap-4'
        >
          <div className='flex flex-col items-start justify-center'>
            <h2 className='text-lg font-bold'>Name</h2>
            <p className='text-xl'>Paulo Oliveira</p>
          </div>
          <div className='flex flex-col items-start justify-center'>
            <h2 className='text-lg font-bold'>Username</h2>
            <p className='text-xl'>powluu</p>
          </div>
          <div className='flex flex-col items-start justify-center'>
            <h2 className='text-lg font-bold'>Email</h2>
            <p className='text-xl'>oliveirapaulo00@hotmail.com</p>
          </div>
        </section>

        <section
          id='buttonRow'
          className='flex flex-row items-center justify-start gap-4'
        >
          <Link
            className='bg-foreground flex flex-row gap-2 text-primary font-semibold px-4 py-3 rounded-md hover:scale-105 transition-transform'
            href='/edit-profile'
          >
            <Pencil className='w-5 h-5' /> Edit Profile
          </Link>
          <Link
            className='bg-foreground text-primary font-semibold px-4 py-3 rounded-md hover:scale-105 transition-transform'
            href='/reset-password'
          >
            Reset Password
          </Link>
        </section>

        <button
          type='button'
          className='w-full flex items-center justify-center py-2 rounded-md font-bold bg-error text-foreground hover:scale-[1.01] transition-transform mt-16'
          onClick={handleLogOut}
        >
          Logout
        </button>
      </main>
    </>
  )
}
