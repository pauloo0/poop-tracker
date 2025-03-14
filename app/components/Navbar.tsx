import Link from 'next/link'

function Navbar({ active }: { active: string }) {
  const activeClass = 'text-highlight font-bold text-lg'

  return (
    <nav className='fixed inset-x-0 bg-primary bottom-0 z-10 flex items-center justify-around py-4 px-2'>
      <Link className={active === 'home' ? activeClass : ''} href='/dashboard'>
        Home
      </Link>
      <Link
        className={active === 'leaderboard' ? activeClass : ''}
        href='/leaderboard'
      >
        Leaders
      </Link>
      <Link
        className={active === 'new-poop' ? activeClass : ''}
        href='/new-poop'
      >
        New Poop
      </Link>
      <Link className={active === 'logs' ? activeClass : ''} href='/logs'>
        Logs
      </Link>
      <Link className={active === 'profile' ? activeClass : ''} href='/profile'>
        Profile
      </Link>
    </nav>
  )
}

export default Navbar
