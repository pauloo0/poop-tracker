'use server'

import { db } from '@/app/lib/firebase'
import { User } from '@/app/lib/types'
import { doc, setDoc } from 'firebase/firestore'

export async function completeUserRegistration(user: User) {
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true })
  } catch (error) {
    console.error('Error in completeUserRegistration', error)
    throw new Error('Failed to complete user registration.')
  }
}
