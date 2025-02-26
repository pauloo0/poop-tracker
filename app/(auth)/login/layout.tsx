export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className='grid h-screen place-items-center'>{children}</section>
  )
}
