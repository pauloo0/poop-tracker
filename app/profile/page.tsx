'use client'

import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/app/lib/firebase'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'
import { User } from '@/app/lib/types'
import { getUserData } from '@/app/profile/actions'
import Loading from '@/app/components/Loading'

export default function Profile() {
  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const router = useRouter()

  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState<boolean>(true)
  const [profileInfo, setProfileInfo] = useState<User | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchUserProfile = async () => {
      try {
        const userId: string = user.uid
        const resProfile = await getUserData(userId)
        const { success, data } = resProfile

        if (!success || !data) throw new Error('User data not found')

        setProfileInfo(data)
      } catch (error) {
        console.error(error)
        setError('Error fetching user data')
      } finally {
        setDataLoading(false)
      }
    }

    fetchUserProfile()
  }, [user])

  const handleLogOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  if (dataLoading) return <Loading />
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-screen w-full'>
        <h1 className='text-2xl font-bold'>{error}</h1>
        <button
          type='button'
          className='px-4 py-2 rounded-md bg-zinc-700 text-foreground'
          onClick={() => router.back()}
        >
          Go back
        </button>
      </div>
    )
  }

  return (
    <main className='p-6 pb-[80px] min-h-screen'>
      <section
        id='userInfo'
        className='my-14 flex flex-col items-start justify-start gap-4'
      >
        {profileInfo && (
          <>
            <div className='flex flex-col items-start justify-center'>
              <h2 className='text-lg font-bold'>Name</h2>
              <p className='text-xl'>
                {profileInfo.firstname + ' ' + profileInfo.lastname}
              </p>
            </div>
            <div className='flex flex-col items-start justify-center'>
              <h2 className='text-lg font-bold'>Email</h2>
              <p className='text-xl'>{profileInfo.email}</p>
            </div>
          </>
        )}
      </section>

      <section
        id='buttonRow'
        className='flex flex-row items-center justify-start gap-4'
      >
        <Link
          className='bg-foreground flex flex-row items-center justify-center gap-2 text-primary font-semibold px-4 py-2 rounded-md hover:scale-105 transition-transform'
          href='/profile/edit'
        >
          <Pencil className='w-4 h-4' /> Edit Profile
        </Link>
        {/* 
          //TODO Implement password reset
        */}
        {/* <Link
          className='bg-foreground text-primary font-semibold px-4 py-3 rounded-md hover:scale-105 transition-transform'
          href='/reset-password'
        >
          Reset Password
        </Link> */}
      </section>

      <button
        type='button'
        className='w-full flex items-center justify-center py-2 rounded-md font-bold bg-error text-foreground hover:scale-[1.01] transition-transform mt-16'
        onClick={handleLogOut}
      >
        Logout
      </button>
    </main>
  )
}
