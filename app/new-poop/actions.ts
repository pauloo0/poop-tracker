'use server'
import { redirect } from 'next/navigation'

export async function addPoop(formData: FormData) {
  console.log(formData)

  redirect('/dashboard')
}
