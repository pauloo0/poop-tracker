'use client'
import Loading from '@/app/components/Loading'
import { useAuthState } from '@/app/hooks/useAuthState'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loading = useAuthState()

  if (loading) {
    return <Loading />
  }

  return (
    <section className='grid h-screen place-items-center'>{children}</section>
  )
}
