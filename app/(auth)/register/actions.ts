'use server'

import { db, auth } from '@/app/lib/firebase'
import { User } from '@/app/lib/types'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export async function completeUserRegistration(user: User) {
  try {
    console.log('Completing registration for user: ', user.id)
    await setDoc(doc(db, 'users', user.id), user, { merge: true })
    console.log('Firestore registration completed for user: ', user.id)
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

  // Basic password validation
  // TODO - Validate formData with zod
  if (newUser.password !== newUser.confirm_password) {
    throw new Error('Passwords do not match.')
  }

  try {
    console.log('Strating email sign-up for: ', newUser.email)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      newUser.password
    )
    const user = userCredential.user
    console.log('Auth user created: ', user.uid)

    const userData = {
      id: user.uid,
      email: user.email || '',
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      createdAt: new Date().toISOString(),
    }

    await completeUserRegistration(userData)
  } catch (error) {
    console.error('Error in createUserEmailPassword: ', error)
    throw error
  }
}
