'use client'

import Form from 'next/form'
import { redirect } from 'next/navigation'
import { editPoop } from './actions'
import { useState, useEffect, use } from 'react'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'

const poop = {
  date: '14/03/2025',
  time: '14:25',
}

interface PoopData {
  date: string
  time: string
}

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

  const id = use(params)

  const [poopData, setPoopData] = useState<PoopData>({
    date: '',
    time: '',
  })

  console.log(id)
  useEffect(() => {
    if (id) {
      setPoopData((prev) => {
        return { ...prev, date: poop.date }
      })
      setPoopData((prev) => {
        return { ...prev, time: poop.time }
      })
    }
  }, [id])

  return (
    <Form action={editPoop} className='flex flex-col gap-6 w-full sm:w-96 p-6'>
      <div className={input_group}>
        <label htmlFor='date' className={input_group_label}>
          Date
        </label>
        <input
          type='text'
          id='date'
          name='date'
          value={poopData.date}
          className={input_group_input}
          onChange={(e) => setPoopData({ ...poopData, date: e.target.value })}
        />
      </div>
      <div className={input_group}>
        <label htmlFor='time' className={input_group_label}>
          Time
        </label>
        <input
          type='time'
          id='time'
          name='time'
          value={poopData.time}
          className={input_group_input}
          onChange={(e) => setPoopData({ ...poopData, time: e.target.value })}
        />
      </div>

      <div
        id='button-group'
        className='flex flex-row items-center justify-center gap-2'
      >
        <button
          type='submit'
          className='bg-primary text-foreground py-2 px-3 rounded-md flex-grow'
        >
          Save
        </button>
        <button
          type='reset'
          className='bg-foreground text-primary py-2 px-2 rounded-md flex-grow'
          onClick={() => redirect('/dashboard')}
        >
          Cancel
        </button>
      </div>
    </Form>
  )
}
