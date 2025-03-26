import Navbar from '@/app/components/Navbar'

export default function LogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar active='logs' />
      {children}
    </>
  )
}
