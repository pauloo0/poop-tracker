'use server'

import { db } from '@/app/lib/firebase'
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  deleteDoc,
} from 'firebase/firestore'
import { PoopLog } from '@/app/lib/types'

export async function getPoopLogs(userId: string) {
  if (!userId) throw new Error('UserID not provided.')

  try {
    const qry = query(collection(db, 'poopLogs'), where('userId', '==', userId))

    const querySnapshot = await getDocs(qry)
    const poopLogs: PoopLog[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        date: data.date,
        time: data.time,
        rating: data.rating,
        location: data.location,
        notes: data.notes,
      }
    })

    return { success: true, data: poopLogs }
  } catch (error) {
    console.error('Error occured on getPoopLogs', error)
    throw error
  }
}

export async function deletePoopLog(userId: string, poopLogId: string) {
  if (!userId) throw new Error('UserID not provided.')

  try {
    const poopLogRef = doc(db, 'poopLogs', poopLogId)

    await deleteDoc(poopLogRef)
    return { success: true, message: 'Poop log deleted.' }
  } catch (error) {
    console.error('Error occured on deletePoopLogs: ', error)
    throw error
  }
}
