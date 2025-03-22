'use client'

import Form from 'next/form'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { createUserEmailPassword } from './actions'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'
import { completeUserRegistration } from './actions'

async function createUserGoogle() {
  const provider = new GoogleAuthProvider()

  try {
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    const userData = {
      id: user.uid,
      email: user.email || '',
      firstname: user.displayName?.split(' ')[0] || '',
      lastname: user.displayName?.split(' ')[1] || '',
      createdAt: new Date().toISOString(),
    }

    console.log('Google user signed in: ', user.uid)
    await completeUserRegistration(userData)
  } catch (error) {
    console.error('Google Sing-Up error: ', error)
    throw error
  }
}

export default function Register() {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleEmailSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await createUserEmailPassword(formData)
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

  const handleGoogleSignUp = () => {
    startTransition(async () => {
      try {
        await createUserGoogle()
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
        <label htmlFor='firstname' className={input_group_label}>
          Firstname
        </label>
        <input
          type='text'
          id='firstname'
          name='firstname'
          placeholder='First name'
          className={input_group_input}
        />
      </div>
      <div className={input_group}>
        <label htmlFor='lastname' className={input_group_label}>
          Lastname
        </label>
        <input
          type='text'
          id='lastname'
          name='lastname'
          placeholder='Last name'
          className={input_group_input}
        />
      </div>
      <div className={input_group}>
        <label htmlFor='email' className={input_group_label}>
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          placeholder='example@email.com'
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
          placeholder='First name'
          className={input_group_input}
        />
      </div>
      <div className={input_group}>
        <label htmlFor='confirm_password' className={input_group_label}>
          Confirm Password
        </label>
        <input
          type='password'
          id='confirm_password'
          name='confirm_password'
          placeholder='Confirm Password'
          className={input_group_input}
        />
      </div>
      <div className='flex flex-col gap-4'>
        <button
          type='submit'
          disabled={isPending}
          className='bg-primary text-foreground py-3 px-6 rounded-2xl flex flex-row items-center justify-start gap-6'
        >
          {isPending ? 'Signing Up...' : 'Register'}
        </button>
        <button
          disabled={isPending}
          onClick={handleGoogleSignUp}
          className='bg-white text-black py-3 px-6 rounded-2xl flex flex-row items-center justify-start gap-6'
        >
          <Image src='/google-logo.webp' alt='' width={24} height={24} />
          {isPending ? 'Signing Up...' : 'Sign up with Google'}
        </button>
      </div>
      {error && <p className='text-error text-center'>{error}</p>}
      <p>
        {`Already have an account? `}{' '}
        <Link className='text-primary hover:underline' href={`/login`}>
          Sign In.
        </Link>
      </p>
    </Form>
  )
}
