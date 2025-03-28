'use server'

import { format } from 'date-fns'
import { db } from '@/app/lib/firebase'
import { PoopLog } from '@/app/lib/types'
import { poopLogSchema } from '@/app/lib/zod'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { z } from 'zod'

export async function getPoopLog(poopId: string, userId: string) {
  if (!userId) throw new Error('UserID not provided.')

  try {
    const docRef = doc(db, 'poopLogs', poopId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw "Couldn't find the provided poop log"
    }

    const docData = docSnap.data()
    const data = {
      id: poopId,
      userId: userId,
      date: docData.date,
      time: docData.time,
      rating: docData.rating,
      location: docData.location,
      notes: docData.notes,
    }

    return { success: true, data: data }
  } catch (error) {
    console.error('Error on getPoopLog from edit poop', error)
    throw error
  }
}

export async function editPoopLog(
  formData: FormData,
  userId: string,
  poopId: string
) {
  const updatedPoopLog = {
    date: new Date(formData.get('date') as string),
    time: formData.get('time') as string,
    rating: Number(formData.get('rating')),
    location: formData.get('location') as string,
    notes: formData.get('notes') as string,
  }

  try {
    const validatedData = poopLogSchema.parse(updatedPoopLog)

    const poopLog: PoopLog = {
      id: poopId,
      userId: userId,
      date: format(validatedData.date, 'yyyy-MM-dd'),
      time: validatedData.time,
      rating: validatedData.rating,
      location: validatedData.location,
      notes: validatedData.notes,
    }

    const docRef = doc(db, 'poopLogs', poopId)

    await updateDoc(docRef, {
      date: poopLog.date,
      time: poopLog.time,
      rating: poopLog.rating,
      location: poopLog.location,
      notes: poopLog.notes,
    })

    return { success: true, message: 'Poop log updated successfully' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: error.flatten().fieldErrors }
    }

    console.error('Error in editPoopLog', error)
    throw error
  }
}
