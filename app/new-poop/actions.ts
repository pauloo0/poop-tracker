'use server'

import { format } from 'date-fns'
import { collection, doc, setDoc } from 'firebase/firestore'
import { z } from 'zod'
import { newPoopLogSchema } from '@/app/lib/zod'
import { db } from '@/app/lib/firebase'
import { PoopLog } from '@/app/lib/types'

export async function createPoopLog(formData: FormData, userId: string) {
  const newPoopLog = {
    date: new Date(formData.get('date') as string),
    time: formData.get('time') as string,
    rating: Number(formData.get('rating')),
    location: formData.get('location') as string,
    notes: formData.get('notes') as string,
  }

  try {
    const validatedData = newPoopLogSchema.parse(newPoopLog)

    const poopLogRef = doc(collection(db, 'poopLogs'))

    const poopLog: PoopLog = {
      userId: userId,
      date: format(validatedData.date, 'yyyy-MM-dd'),
      time: validatedData.time,
      rating: validatedData.rating,
      location: validatedData.location,
      notes: validatedData.notes,
    }

    await setDoc(poopLogRef, poopLog)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: error.flatten().fieldErrors }
    }

    console.error('Error in addPoop', error)
    throw error
  }
}
