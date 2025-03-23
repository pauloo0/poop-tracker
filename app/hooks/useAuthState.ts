'use client'

import { useRouter } from 'next/navigation'
import { auth } from '@/app/lib/firebase'
import { useEffect, useState } from 'react'

export function useAuthState() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log({ user })

      if (!user) {
        router.push('/login')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  return loading
}
