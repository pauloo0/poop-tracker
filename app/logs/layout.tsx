import Navbar from '../components/Navbar'

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
