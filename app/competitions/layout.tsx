import Navbar from '@/app/components/Navbar'

export default function CompetitionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar active='competitions' />
      {children}
    </>
  )
}
