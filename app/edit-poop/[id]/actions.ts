'use server'
import { redirect } from 'next/navigation'

export async function editPoop(formData: FormData) {
  console.log(formData)

  redirect('/dashboard')
}
