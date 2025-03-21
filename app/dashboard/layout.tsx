import Navbar from '../components/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar active='home' />
      {children}
    </>
  )
}
