'use server'

import { format, startOfYear, endOfYear } from 'date-fns'
import { collection, doc, setDoc } from 'firebase/firestore'
import { z } from 'zod'
import { competitionSchema } from '@/app/lib/zod'
import { db } from '@/app/lib/firebase'
import { Competition } from '@/app/lib/types'

export async function createCompetition(formData: FormData, userId: string) {
  const today = new Date()
  const firstDayOfYear = startOfYear(today)
  const lastDayOfYear = endOfYear(today)

  const newCompetition = {
    name: formData.get('name') as string,
    createdBy: userId,
    members: [userId], // creates the competition only with the only member being creator
    startDate: firstDayOfYear,
    endDate: lastDayOfYear,
    ended: false,
    winner: '',
  }

  try {
    const validatedData = competitionSchema.parse(newCompetition)

    const competitionRef = doc(collection(db, 'competitions'))
    const competition: Competition = {
      name: validatedData.name,
      createdBy: validatedData.createdBy,
      members: validatedData.members,
      startDate: format(validatedData.startDate, 'yyyy-MM-dd'),
      endDate: validatedData.endDate
        ? format(validatedData.endDate, 'yyyy-MM-dd')
        : '1900-01-01',
      ended: validatedData.ended,
      winner: validatedData.winner || '',
    }

    await setDoc(competitionRef, competition)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: error.flatten().fieldErrors }
    }

    console.error('Error in createCompetition', error)
    throw error
  }
}
