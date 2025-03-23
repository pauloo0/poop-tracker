'use client'

import { usePathname, useRouter } from 'next/navigation'
import { auth } from '@/app/lib/firebase'
import { useEffect, useState } from 'react'

export function useAuthState() {
  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (
        (pathname === '/login' ||
          pathname === '/register' ||
          pathname === '/') &&
        user
      ) {
        router.push('/dashboard')
      } else if (
        pathname !== '/login' &&
        pathname !== '/register' &&
        pathname !== '/' &&
        !user
      ) {
        router.push('/login')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, pathname])

  return loading
}
