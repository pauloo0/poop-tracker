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

    if (user) {
      if (publicRoutes.includes(pathname)) {
        router.push('/dashboard')
      }
    } else {
      if (!publicRoutes.includes(pathname)) {
        router.push('/login')
      }
    }
  }, [loading, user, router, pathname])
}
