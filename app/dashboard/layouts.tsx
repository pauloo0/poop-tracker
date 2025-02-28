export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className='grid h-screen place-items-center'>{children}</section>
  )
}
