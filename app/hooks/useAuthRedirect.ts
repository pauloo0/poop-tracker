'use client'

import { User } from 'firebase/auth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuthRedirect({
  loading,
  user,
}: {
  loading: boolean
  user: User | null
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    const publicRoutes = ['/', '/login', '/register']
    const invitationLink = sessionStorage.getItem('invitationLink')

    if (user) {
      if (pathname.startsWith('/invitations/')) return

      if (publicRoutes.includes(pathname)) {
        router.push(invitationLink || '/dashboard')
        if (invitationLink) {
          sessionStorage.removeItem('invitationLink')
        }
      }
    } else {
      if (
        !publicRoutes.includes(pathname) &&
        !pathname.startsWith('/invitations/')
      ) {
        router.push('/login')
      }
    }
  }, [loading, user, router, pathname])
}
