'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { PoopLog } from '@/app/lib/types'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'
import { getPoopLogs } from './actions'

export default function Logs() {
  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const [poopLogs, setPoopLogs] = useState<PoopLog[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPoopLogs = async () => {
      if (!user) {
        return
      }

      try {
        const res = await getPoopLogs(user.uid)
        setPoopLogs(res.data)
      } catch (error) {
        console.error(error)
        setError('Error fetching poop logs')
      }
    }

    fetchPoopLogs()
  }, [user])

  if (error) {
    return <h1 className='text-2xl'>{error}</h1>
  }

  return (
    <>
      <main className='p-6'>
        <section
          id='filters'
          className='flex flex-col items-center justify-between w-full gap-4 sm:items-end sm:flex-row my-14'
        >
          <div
            id='comboboxes'
            className='flex flex-row items-center justify-center gap-4 w-full sm:w-1/3'
          >
            <div className='flex flex-col flex-1'>
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
            <div className='flex flex-col flex-1'>
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
          </div>

          <Link
            href='/new-poop'
            className='flex flex-row items-center justify-center w-full px-3 py-2 rounded-md bg-primary text-foreground sm:w-48'
          >
            Log poop
          </Link>
        </section>

        <section id='logs'>
          <ul>
            {poopLogs ? (
              poopLogs.map((poopLog) => (
                <li
                  key={poopLog.id}
                  className='flex flex-row items-center justify-between font-bold border-b-2 border-b-primary p-2'
                >
                  <div className='flex flex-row items-center gap-4'>
                    {poopLog.date} @ {poopLog.time}
                  </div>
                  <Link href={`/edit-poop/${poopLog.id}`}>
                    <Pencil className='h-5 w-5' />
                  </Link>
                </li>
              ))
            ) : (
              <h1>No poop logs found.</h1>
            )}
          </ul>
        </section>
      </main>
    </>
  )
}
