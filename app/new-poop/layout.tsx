'use client'

import Navbar from '@/app/components/Navbar'
import Loading from '@/app/components/Loading'
import { useAuthState } from '@/app/hooks/useAuthState'

export default function NewPoopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loading = useAuthState()

  if (loading) {
    return <Loading />
  }

  return (
    <section className='grid h-screen place-items-center'>
      <Navbar active='' />
      {children}
    </section>
  )
}
