'use server'
import { redirect } from 'next/navigation'

export async function createUser(formData: FormData) {
  console.log(formData)

  redirect('/dashboard')
}
