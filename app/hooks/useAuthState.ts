'use client'

import { usePathname, useRouter } from 'next/navigation'
import { auth } from '@/app/lib/firebase'
import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'

export function useAuthState() {
  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, pathname])

  return { loading, user }
}
