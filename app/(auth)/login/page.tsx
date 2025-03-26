'use client'

import Form from 'next/form'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'

import { auth, googleProvider } from '@/app/lib/firebase'
import { loginUserEmailPassword } from './actions'
import { signInWithPopup } from 'firebase/auth'

async function loginUserGoogle() {
  try {
    await signInWithPopup(auth, googleProvider)
  } catch (error) {
    console.error('Google Login error: ', error)
    throw error
  }
}

export default function Login() {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleEmailSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await loginUserEmailPassword(formData)
        router.push('/dashboard')
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to sign up with email/password.'
        )
      }
    })
  }

  const handleGoogleLogin = () => {
    startTransition(async () => {
      try {
        await loginUserGoogle()
        router.push('/dashboard')
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to sign up with Google.'
        )
      }
    })
  }

  return (
    <Form
      action={handleEmailSubmit}
      className='flex flex-col gap-6 w-full sm:w-96 p-6'
    >
      <div className={input_group}>
        <label htmlFor='email' className={input_group_label}>
          Email
        </label>
        <input
          type='text'
          id='email'
          name='email'
          placeholder='Email'
          className={input_group_input}
        />
      </div>

      <div className={input_group}>
        <label htmlFor='password' className={input_group_label}>
          Password
        </label>
        <input
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          className={input_group_input}
        />
      </div>

      <div className='flex flex-col gap-4'>
        <button
          type='submit'
          disabled={isPending}
          className='bg-primary text-foreground py-3 px-6 rounded-2xl flex flex-row items-center justify-start gap-6'
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>
        <button
          disabled={isPending}
          onClick={handleGoogleLogin}
          className='bg-white text-black py-3 px-6 rounded-2xl flex flex-row items-center justify-start gap-6'
        >
          <Image src='/google-logo.webp' alt='' width={24} height={24} />
          {isPending ? 'Logging in...' : 'Login with Google'}
        </button>
      </div>
      {error && <p className='text-error text-center'>{error}</p>}
      <p>
        {`Don't have an account? `}{' '}
        <Link className='text-primary hover:underline' href={`/register`}>
          Create an account.
        </Link>
      </p>
    </Form>
  )
}
