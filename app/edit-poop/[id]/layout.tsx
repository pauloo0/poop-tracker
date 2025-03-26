import Navbar from '@/app/components/Navbar'

export default function EditPoopLayout({
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
