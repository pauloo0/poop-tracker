'use server'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'

export async function loginUserEmailPassword(formData: FormData) {
  const loggedUser = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  try {
    await signInWithEmailAndPassword(
      auth,
      loggedUser.email,
      loggedUser.password
    )
  } catch (error) {
    console.error('Error in loginUserEmailPassword: ', error)
    throw error
  }
}
