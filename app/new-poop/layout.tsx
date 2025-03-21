import Navbar from '../components/Navbar'

export default function NewPoopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className='grid h-screen place-items-center'>
      <Navbar active='' />
      {children}
    </section>
  )
}
