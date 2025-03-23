'use client'

import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function NewCompetition() {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  const router = useRouter()

  const [competitionName, setCompetitionName] =
    useState<string>('New Competition')

  return (
    <main className='grid min-h-screen place-items-center'>
      <Form
        action='handleCompetitionSubmit'
        className='flex flex-col w-full gap-6 p-6 sm:w-96'
      >
        <div className={input_group}>
          <label htmlFor='name' className={input_group_label}>
            Competition Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            placeholder='Competition Name'
            value={competitionName}
            onChange={(e) => setCompetitionName(e.target.value)}
            className={input_group_input}
          />
        </div>

        <div
          id='button-group'
          className='flex flex-row items-center justify-center gap-2'
        >
          <button
            type='submit'
            className='flex-grow px-3 py-2 rounded-md bg-primary text-foreground'
          >
            Save
          </button>
          <button
            type='reset'
            className='flex-grow px-2 py-2 rounded-md bg-foreground text-primary'
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </Form>
    </main>
  )
}

export default NewCompetition
