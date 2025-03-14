import Link from 'next/link'
import { Pencil } from 'lucide-react'

export default function Logs() {
  return (
    <>
      <main className='p-6'>
        <section
          id='filters'
          className='my-14 flex flex-row items-center justify-between'
        >
          <div className='flex flex-col'>
            <label htmlFor='month' className='px-1 text-foregroung'>
              Month
            </label>
            <select
              name='month'
              id='month'
              className='bg-background py-2 px-3 border-2 border-primary rounded-md'
            >
              <option value='all'>All</option>
              <option value='jan'>January</option>
              <option value='feb'>February</option>
              <option value='mar'>March</option>
              <option value='apr'>April</option>
              <option value='may'>May</option>
              <option value='jun'>June</option>
              <option value='july'>July</option>
              <option value='aug'>August</option>
              <option value='sep'>September</option>
              <option value='oct'>October</option>
              <option value='nov'>November</option>
              <option value='dec'>December</option>
            </select>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='year' className='px-1 text-foregroung'>
              Year
            </label>
            <select
              name='year'
              id='year'
              className='bg-background py-2 px-3 border-2 border-primary rounded-md'
            >
              <option value='all'>All</option>
              <option value='2025'>2025</option>
              <option value='2024'>2024</option>
              <option value='2023'>2023</option>
              <option value='2022'>2022</option>
              <option value='2021'>2021</option>
            </select>
          </div>
        </section>

        <section id='logs'>
          <ul>
            <li className='flex flex-row items-center justify-between font-bold border-b-2 border-b-primary p-2'>
              <div className='flex flex-row items-center gap-4'>
                2025-01-01 @ 12:30
              </div>
              <Link href='#'>
                <Pencil className='h-5 w-5' />
              </Link>
            </li>
            <li className='flex flex-row items-center justify-between font-bold border-b-2 border-b-primary p-2'>
              <div className='flex flex-row items-center gap-4'>
                2025-01-02 @ 11:32
              </div>
              <Link href='#'>
                <Pencil className='h-5 w-5' />
              </Link>
            </li>
            <li className='flex flex-row items-center justify-between font-bold border-b-2 border-b-primary p-2'>
              <div className='flex flex-row items-center gap-4'>
                2025-01-03 @ 16:46
              </div>
              <Link href='#'>
                <Pencil className='h-5 w-5' />
              </Link>
            </li>
            <li className='flex flex-row items-center justify-between font-bold border-b-2 border-b-primary p-2'>
              <div className='flex flex-row items-center gap-4'>
                2025-01-04 @ 12:59
              </div>
              <Link href='#'>
                <Pencil className='h-5 w-5' />
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  )
}
