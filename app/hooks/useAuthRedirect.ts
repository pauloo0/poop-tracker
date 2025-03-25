'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuthState } from '@/app/hooks/useAuthState'

export function useAuthRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  const { loading, userId } = useAuthState()

  if (!loading) {
    if (
      (pathname === '/login' || pathname === '/register' || pathname === '/') &&
      userId
    ) {
      router.push('/dashboard')
    } else if (
      pathname !== '/login' &&
      pathname !== '/register' &&
      pathname !== '/' &&
      !userId
    ) {
      router.push('/login')
    }
  }
}
