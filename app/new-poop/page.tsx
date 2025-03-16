'use client'

import Form from 'next/form'
import { addPoop } from './actions'
import { redirect } from 'next/navigation'
import { useState } from 'react'

export default function NewPoop() {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  const currentDate: Date = new Date()
  const currentDateString: string = currentDate.toLocaleDateString()
  const currentHours: number = currentDate.getHours()
  const currentMinutes: number = currentDate.getMinutes()
  const currentTime: string = currentHours + ':' + currentMinutes

  const [date, setDate] = useState<string>(currentDateString)
  const [time, setTime] = useState<string>(currentTime)

  return (
    <Form action={addPoop} className='flex flex-col gap-6 w-full sm:w-96 p-6'>
      <div className={input_group}>
        <label htmlFor='date' className={input_group_label}>
          Date
        </label>
        <input
          type='text'
          id='date'
          name='date'
          value={date}
          className={input_group_input}
          onChange={(e) => setDate(e.target.value)}
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
          value={time}
          className={input_group_input}
          onChange={(e) => setTime(e.target.value)}
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
