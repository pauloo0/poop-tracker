'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Loading from '@/app/components/Loading'
import { useAuthState } from '@/app/hooks/useAuthState'
import { addUser } from '@/app/invitations/[token]/actions'

function Invitations({ params }: { params: Promise<{ token: string }> }) {
  const { user, loading: authLoading } = useAuthState()
  const { token } = use(params)
  const router = useRouter()
  const pathname = usePathname()

  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const addUserToCompetition = async (
    token: string,
    userId: string
  ): Promise<void> => {
    try {
      const res = await addUser(token, userId)
      const { success, data } = res

      if (!success || !data || !data.competitionId) {
        throw new Error("Couldn't add user to competition")
      }

      const invitationLink = sessionStorage.getItem('invitationLink')
      if (invitationLink) {
        sessionStorage.removeItem('invitationLink')
      }
      router.push(`/competitions?competition=${data.competitionId}`)
    } catch (error) {
      console.error('Error adding user to competition', error)
      setError(`Couldn't add you to the competition: ${error}`)
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    const handleUserAction = async () => {
      if (!user) {
        console.log(pathname)
        sessionStorage.setItem('invitationLink', pathname)
        router.push('/register')
      } else {
        await addUserToCompetition(token, user.uid)
      }
    }

    if (!authLoading) {
      handleUserAction()
    }
  }, [authLoading, user, pathname, router, token])

  if (authLoading || dataLoading) {
    return <Loading />
  }

  return <div>{error}</div>
}

export default Invitations
