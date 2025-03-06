'use server'
import { redirect } from 'next/navigation'

export async function loginUser(formData: FormData) {
  console.log(formData)

  redirect('/dashboard')
}
