'use server'

import { db } from '@/app/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { z } from 'zod'
import { updatedUserSchema } from '@/app/lib/zod'

export async function editUserInfo(formData: FormData, userId: string) {
  if (!userId) throw new Error('UserID not provided.')

  const updatedUser = {
    firstname: formData.get('firstname') as string,
    lastname: formData.get('lastname') as string,
  }

  try {
    const validatedData = updatedUserSchema.parse(updatedUser)

    const userRef = doc(db, 'users', userId)

    await updateDoc(userRef, {
      firstname: validatedData.firstname,
      lastname: validatedData.lastname,
    })

    return { success: true, message: 'User updated successfully.' }
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: {
          errors: error.flatten().fieldErrors,
        },
      }
    } else {
      return {
        success: false,
        data: {
          error: error,
        },
      }
    }
  }
}
