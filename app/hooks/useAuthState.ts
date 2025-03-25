'use client'

import { usePathname, useRouter } from 'next/navigation'
import { auth } from '@/app/lib/firebase'
import { useEffect, useState } from 'react'

export function useAuthState() {
  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : undefined)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, pathname])

  return { loading, userId }
}
