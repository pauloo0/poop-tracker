'use client'

import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'
import { CompetitionFormErrors } from '@/app/lib/types'
import { createCompetition } from '@/app/competitions/new/actions'

function NewCompetition() {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const router = useRouter()

  const [competitionName, setCompetitionName] =
    useState<string>('New Competition')

  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<CompetitionFormErrors | null>(null)

  const handleCompetitionSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        if (!user) throw new Error('User not signed in.')
        const userId: string = user.uid

        const result = await createCompetition(formData, userId)

        if (result && 'errors' in result) {
          setErrors(result.errors as CompetitionFormErrors)
        } else {
          setErrors(null)
          router.back()
        }
      } catch (error) {
        setErrors({
          general: [
            error instanceof Error
              ? error.message
              : 'Failed to create competition.',
          ],
        })
      }
    })
  }

  return (
    <main className='grid min-h-screen place-items-center pb-[80px]'>
      <Form
        action={handleCompetitionSubmit}
        className='flex flex-col w-full gap-6 p-6 sm:w-96'
      >
        <div className={input_group}>
          <label htmlFor='name' className={input_group_label}>
            Competition Name *
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
          {errors?.name && (
            <p className='text-sm text-red-500'>{errors?.name[0]}</p>
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
    </main>
  )
}

export default NewCompetition
