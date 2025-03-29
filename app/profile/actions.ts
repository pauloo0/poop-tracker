'use server'

import { db } from '@/app/lib/firebase'
import { getDoc, doc } from 'firebase/firestore'

export async function getUserData(userId: string) {
  if (!userId) throw new Error('UserID not provided.')

  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) throw "Couldn't find the prvided user"

    const docData = docSnap.data()
    const userData = {
      id: userId,
      email: docData.email,
      firstname: docData.firstname,
      lastname: docData.lastname,
      fullname: `${docData.firstname} ${docData.lastname}`,
    }

    return { success: true, data: userData }
  } catch (error) {
    console.error('Error on getUserData: ', error)
    throw error
  }
}
