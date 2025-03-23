'use client'

import Navbar from '../components/Navbar'
import { useAuthState } from '@/app/hooks/useAuthState'
import Loading from '@/app/components/Loading'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loading = useAuthState()

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Navbar active='home' />
      {children}
    </>
  )
}
