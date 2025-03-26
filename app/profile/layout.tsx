import Navbar from '@/app/components/Navbar'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar active='profile' />
      {children}
    </>
  )
}
