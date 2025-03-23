'use client'

import Form from 'next/form'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { createUserEmailPassword } from './actions'
import { signInWithPopup } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'
import { googleProvider } from '@/app/lib/firebase'
import { completeUserRegistration } from './actions'
import { RegisterFormErrors } from '@/app/lib/types'

async function createUserGoogle() {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider)
    const user = userCredential.user

    const userData = {
      id: user.uid,
      email: user.email || '',
      firstname: user.displayName?.split(' ')[0] || '',
      lastname: user.displayName?.split(' ')[1] || '',
      createdAt: new Date().toISOString(),
    }

    await completeUserRegistration(userData)
  } catch (error) {
    throw error
  }
}

export default function Register() {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<RegisterFormErrors | null>(null)

  const handleEmailSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await createUserEmailPassword(formData)

        if (result && 'errors' in result) {
          setErrors(result.errors as RegisterFormErrors)
        } else {
          setErrors(null)
          router.push('/dashboard')
        }
      } catch (error) {
        setErrors({
          general: [
            error instanceof Error
              ? error.message
              : 'Failed to sign up with email/password.',
          ],
        })
      }
    })
  }

  const handleGoogleSignUp = () => {
    startTransition(async () => {
      try {
        await createUserGoogle()
        router.push('/dashboard')
      } catch (error) {
        setErrors({
          general: [
            error instanceof Error
              ? error.message
              : 'Failed to sign up with email/password.',
          ],
        })
      }
    })
  }

  return (
    <Form
      action={handleEmailSubmit}
      className='flex flex-col w-full gap-6 p-6 sm:w-96'
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
        {errors?.firstname && (
          <p className='text-sm text-red-500'>{errors.firstname[0]}</p>
        )}
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
        {errors?.lastname && (
          <p className='text-sm text-red-500'>{errors.lastname[0]}</p>
        )}
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
        {errors?.email && (
          <p className='text-sm text-red-500'>{errors.email[0]}</p>
        )}
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
        {errors?.password && (
          <p className='text-sm text-red-500'>{errors.password[0]}</p>
        )}
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
        {errors?.confirm_password && (
          <p className='text-sm text-red-500'>{errors.confirm_password[0]}</p>
        )}
      </div>
      <div className='flex flex-col gap-4'>
        <button
          type='submit'
          disabled={isPending}
          className='flex flex-row items-center justify-start gap-6 px-6 py-3 bg-primary text-foreground rounded-2xl'
        >
          {isPending ? 'Signing Up...' : 'Register'}
        </button>
        <button
          disabled={isPending}
          onClick={handleGoogleSignUp}
          className='flex flex-row items-center justify-start gap-6 px-6 py-3 text-black bg-white rounded-2xl'
        >
          <Image src='/google-logo.webp' alt='' width={24} height={24} />
          {isPending ? 'Signing Up...' : 'Sign up with Google'}
        </button>
      </div>
      {errors?.general && (
        <p className='text-sm text-red-500'>{errors.general[0]}</p>
      )}
      <p>
        {`Already have an account? `}{' '}
        <Link className='text-primary hover:underline' href={`/login`}>
          Sign In.
        </Link>
      </p>
    </Form>
  )
}
