'use client'

import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'
import { User, UserUpdateErrors } from '@/app/lib/types'
import { editUserInfo } from '@/app/profile/edit/actions'
import { getUserData } from '@/app/profile/actions'
import Loading from '@/app/components/Loading'

function EditProfile() {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<UserUpdateErrors | null>(null)
  const [userData, setUserData] = useState<User>()
  const [dataLoading, setDataLoading] = useState<boolean>(true)
  const [dataError, setDataError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const userId: string = user.uid

    const fetchUserData = async () => {
      try {
        const res = await getUserData(userId)
        const { success, data } = res

        if (!success || !data) throw new Error("Couln't find this user")

        setUserData(data)
      } catch (error) {
        console.error('Error getting user data: ', error)
        setDataError('Error getting user data')
      } finally {
        setDataLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleUserUpdateSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        if (!user) throw new Error('User not signed in.')
        const userId: string = user.uid

        const result = await editUserInfo(formData, userId)

        if (result && 'errors' in result) {
          setErrors(result.errors as UserUpdateErrors)
        } else {
          setErrors(null)
          router.back()
        }
      } catch (error) {
        setErrors({
          general: [
            error instanceof Error
              ? error.message
              : 'Failed to update user info',
          ],
        })
      }
    })
  }

  if (dataLoading) return <Loading />

  if (!userData) {
    return (
      <div className='flex flex-col items-center justify-center h-screen w-full gap-4'>
        <h1 className='text-2xl'>User data not found!</h1>
        <p>Error: {dataError}</p>
        <button
          type='button'
          className='bg-zinc-700 px-4 py-2 rounded-md text-foreground'
          onClick={() => router.back()}
        >
          Go back
        </button>
      </div>
    )
  }

  return (
    <main className='grid min-h-screen place-items-center pb-[80px]'>
      <Form
        action={handleUserUpdateSubmit}
        className='flex flex-col w-full gap-6 p-6 sm:w-96'
      >
        <div className={input_group}>
          <label htmlFor='firstname' className={input_group_label}>
            First name
          </label>
          <input
            type='text'
            id='firstname'
            name='firstname'
            value={userData.firstname}
            onChange={(e) =>
              setUserData({ ...userData, firstname: e.target.value })
            }
            className={input_group_input}
          />
          {errors?.firstname && (
            <p className='text-sm text-red-500'>{errors?.firstname[0]}</p>
          )}
        </div>
        <div className={input_group}>
          <label htmlFor='lastname' className={input_group_label}>
            First name
          </label>
          <input
            type='text'
            id='lastname'
            name='lastname'
            value={userData.lastname}
            onChange={(e) =>
              setUserData({ ...userData, lastname: e.target.value })
            }
            className={input_group_input}
          />
          {errors?.lastname && (
            <p className='text-sm text-red-500'>{errors?.lastname[0]}</p>
          )}
        </div>

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
            className='bg-foreground text-primary py-2 px-3 rounded-md flex-grow'
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </Form>
    </main>
  )
}

export default EditProfile
