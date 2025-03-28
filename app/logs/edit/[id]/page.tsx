'use client'

import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { editPoopLog, getPoopLog } from './actions'
import { useState, useEffect, use, useTransition } from 'react'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'
import { PoopLog, PoopLogFormErrors } from '@/app/lib/types'
import Loading from '@/app/components/Loading'

export default function EditPoop({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const { id } = use(params)
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [formErrors, setFormErrors] = useState<PoopLogFormErrors | null>(null)
  const [poopData, setPoopData] = useState<PoopLog>()
  const [dataLoading, setDataLoading] = useState<boolean>(true)
  const [dataError, setDataError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPoopLog = async () => {
      if (!id || !user) {
        return
      }
      const userId = user.uid

      try {
        const res = await getPoopLog(id, userId)
        const log = res.data

        if (!log) {
          throw "Couldn't get poop log data"
        }

        setPoopData(res.data)
        setDataLoading(false)
      } catch (error) {
        console.error('Error fetching poop log', error)
        setDataError('Error fetching poopLog')
      }
    }

    fetchPoopLog()
  }, [id, user])

  const handlePoopLogSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        if (!user) {
          throw new Error('User not signed in.')
        }
        const userId = user.uid

        const result = await editPoopLog(formData, userId, id)

        if (result && 'errors' in result) {
          setFormErrors(result.errors as PoopLogFormErrors)
        } else {
          setFormErrors(null)
          router.back()
        }
      } catch (error) {
        setFormErrors({
          general: [
            error instanceof Error
              ? error.message
              : 'Failed to create new poop record.',
          ],
        })
      }
    })
  }

  if (dataLoading) {
    return <Loading />
  }

  if (!poopData)
    return (
      <>
        <h1>Poop Data not found!</h1>
        <p>Error: {dataError}</p>
        <button onClick={() => router.back()}>Go back</button>
      </>
    )

  return (
    <Form
      action={handlePoopLogSubmit}
      className='flex flex-col gap-6 w-full sm:w-96 p-6'
    >
      <div className={input_group}>
        <label htmlFor='date' className={input_group_label}>
          Date *
        </label>
        <input
          type='date'
          id='date'
          name='date'
          value={poopData.date}
          className={input_group_input}
          onChange={(e) => setPoopData({ ...poopData, date: e.target.value })}
        />
        {formErrors?.date && (
          <p className='text-sm text-red-500'>{formErrors?.date[0]}</p>
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
          value={poopData.time}
          className={input_group_input}
          onChange={(e) => setPoopData({ ...poopData, time: e.target.value })}
        />
        {formErrors?.time && (
          <p className='text-sm text-red-500'>{formErrors?.time[0]}</p>
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
          value={poopData.rating}
          className={input_group_input}
          onChange={(e) =>
            setPoopData({ ...poopData, rating: Number(e.target.value) })
          }
        />
        {formErrors?.rating && (
          <p className='text-sm text-red-500'>{formErrors?.rating[0]}</p>
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
          value={poopData.location}
          className={input_group_input}
          onChange={(e) =>
            setPoopData({ ...poopData, location: e.target.value })
          }
        />
      </div>
      {formErrors?.location && (
        <p className='text-sm text-red-500'>{formErrors?.location[0]}</p>
      )}
      <div className={input_group}>
        <label htmlFor='notes' className={input_group_label}>
          Notes
        </label>
        <textarea
          id='notes'
          name='notes'
          value={poopData.notes}
          rows={10}
          className={input_group_input}
          onChange={(e) => setPoopData({ ...poopData, date: e.target.value })}
        />
        {formErrors?.notes && (
          <p className='text-sm text-red-500'>{formErrors?.notes[0]}</p>
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
          className='bg-primary text-foreground py-2 px-3 rounded-md flex-grow'
        >
          Save
        </button>
        <button
          type='reset'
          disabled={isPending}
          className='bg-foreground text-primary py-2 px-2 rounded-md flex-grow'
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </Form>
  )
}
