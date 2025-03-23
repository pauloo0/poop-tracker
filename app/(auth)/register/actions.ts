'use server'

import { db, auth } from '@/app/lib/firebase'
import { User } from '@/app/lib/types'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { newUserSchema } from '@/app/lib/zod'
import { z } from 'zod'

export async function completeUserRegistration(user: User) {
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true })
  } catch (error) {
    console.error('Error in completeUserRegistration', error)
    throw new Error('Failed to complete user registration.')
  }
}

export async function createUserEmailPassword(formData: FormData) {
  const newUser = {
    firstname: formData.get('firstname') as string,
    lastname: formData.get('lastname') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirm_password: formData.get('confirm_password') as string,
  }

  try {
    const validatedData = newUserSchema.parse(newUser)

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      validatedData.email,
      validatedData.password
    )
    const user = userCredential.user

    const userData = {
      id: user.uid,
      email: user.email || '',
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      createdAt: new Date().toISOString(),
    }

    await completeUserRegistration(userData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: error.flatten().fieldErrors }
    }

    console.error('Error in createUserEmailPassword: ', error)
    throw error
  }
}
