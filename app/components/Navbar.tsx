import Link from 'next/link'
import Image from 'next/image'

function Navbar({ active }: { active: string }) {
  return (
    <nav className='fixed inset-x-0 bg-gradient-to-b from-yellow-900 to-amber-900 bottom-0 z-10 flex items-center justify-around py-4 px-2'>
      <Link href='/dashboard'>
        <Image
          src={`/${active === 'home' ? 'home-filled.svg' : 'home.svg'}`}
          alt='Home'
          width={30}
          height={30}
        />
      </Link>
      <Link href='/competitions'>
        <Image
          src={`/${
            active === 'competitions'
              ? 'competitions-filled.svg'
              : 'competitions.svg'
          }`}
          alt='Competitions'
          width={30}
          height={30}
        />
      </Link>
      <Link href='/logs'>
        <Image
          src={`/${active === 'logs' ? 'logs-filled.svg' : 'logs.svg'}`}
          alt='Logs'
          width={30}
          height={30}
        />
      </Link>
      <Link href='/profile'>
        <Image
          src={`/${
            active === 'profile' ? 'profile-filled.svg' : 'profile.svg'
          }`}
          alt='Profile'
          width={30}
          height={30}
        />
      </Link>
    </nav>
  )
}

export default Navbar
