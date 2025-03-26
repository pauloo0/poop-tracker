'use client'

import Form from 'next/form'
import { createPoopLog } from './actions'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { format } from 'date-fns'
import { PoopLogFormErrors } from '@/app/lib/types'
import { auth } from '@/app/lib/firebase'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'

export default function NewPoop() {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const router = useRouter()

  const currentDate: Date = new Date()
  const currentDateString: string = format(currentDate, 'yyyy-MM-dd')
  const currentTime: string = format(currentDate, 'HH:mm')

  const [date, setDate] = useState<string>(currentDateString)
  const [time, setTime] = useState<string>(currentTime)
  const [rating, setRating] = useState<number>(0)
  const [location, setLocation] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<PoopLogFormErrors | null>(null)

  const handlePoopLogSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const user = auth.currentUser
        if (!user) {
          throw new Error('User not signed in.')
        }
        const userId = user.uid

        const result = await createPoopLog(formData, userId)

        if (result && 'errors' in result) {
          setErrors(result.errors as PoopLogFormErrors)
        } else {
          setErrors(null)
          router.back()
        }
      } catch (error) {
        setErrors({
          general: [
            error instanceof Error
              ? error.message
              : 'Failed to create new poop record.',
          ],
        })
      }
    })
  }

  return (
    <Form
      action={handlePoopLogSubmit}
      className='flex flex-col w-full gap-6 p-6 sm:w-96'
    >
      <div className={input_group}>
        <label htmlFor='date' className={input_group_label}>
          Date *
        </label>
        <input
          type='date'
          id='date'
          name='date'
          value={date}
          className={input_group_input}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors?.date && (
          <p className='text-sm text-red-500'>{errors?.date[0]}</p>
        )}
      </div>
      <div className={input_group}>
        <label htmlFor='time' className={input_group_label}>
          Time *
        </label>
        <input
          type='time'
          id='time'
          name='time'
          value={time}
          className={input_group_input}
          onChange={(e) => setTime(e.target.value)}
        />
        {errors?.time && (
          <p className='text-sm text-red-500'>{errors?.time[0]}</p>
        )}
      </div>
      <div className={input_group}>
        <label htmlFor='rating' className={input_group_label}>
          Rating (1 - 5)
        </label>
        <input
          type='number'
          id='rating'
          name='rating'
          value={rating}
          className={input_group_input}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        {errors?.rating && (
          <p className='text-sm text-red-500'>{errors?.rating[0]}</p>
        )}
      </div>
      <div className={input_group}>
        <label htmlFor='location' className={input_group_label}>
          Location
        </label>
        <input
          type='text'
          id='location'
          name='location'
          value={location}
          className={input_group_input}
          onChange={(e) => setLocation(e.target.value)}
        />
        {errors?.location && (
          <p className='text-sm text-red-500'>{errors?.location[0]}</p>
        )}
      </div>
      <div className={input_group}>
        <label htmlFor='notes' className={input_group_label}>
          Notes
        </label>
        <textarea
          id='notes'
          name='notes'
          value={notes}
          rows={10}
          className={input_group_input}
          onChange={(e) => setNotes(e.target.value)}
        />
        {errors?.notes && (
          <p className='text-sm text-red-500'>{errors?.notes[0]}</p>
        )}
      </div>
      <p className='text-sm'>* Required fields</p>
      <div
        id='button-group'
        className='flex flex-row items-center justify-center gap-2'
      >
        <button
          type='submit'
          disabled={isPending}
          className='flex-grow px-3 py-2 rounded-md bg-primary text-foreground'
        >
          Save
        </button>
        <button
          type='reset'
          disabled={isPending}
          className='flex-grow px-2 py-2 rounded-md bg-foreground text-primary'
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </Form>
  )
}
