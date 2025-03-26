'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { PoopLog } from '@/app/lib/types'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'
import { getPoopLogs } from './actions'
import { format, getYear } from 'date-fns'

export default function Logs() {
  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState<boolean>(true)
  const [poopLogs, setPoopLogs] = useState<PoopLog[] | null>(null)

  const [filteredPoopLogs, setFilteredPoopLogs] = useState<PoopLog[] | null>(
    null
  )
  const [months, setMonths] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [years, setYears] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('all')

  useEffect(() => {
    const fetchPoopLogs = async () => {
      if (!user) {
        return
      }

      try {
        const res = await getPoopLogs(user.uid)
        const logs = res.data.sort((a: PoopLog, b: PoopLog) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()

          return dateB - dateA
        })

        const logsMonths = logs
          .map((log: PoopLog) => format(new Date(log.date), 'MMMM'))
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort(
            (a, b) =>
              new Date(`01 ${a} 2000`).getMonth() -
              new Date(`01 ${b} 2000`).getMonth()
          )

        const logsYears = logs
          .map((log: PoopLog) => getYear(log.date).toString())
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => Number(a) - Number(b))

        setPoopLogs(logs)
        setMonths(logsMonths)
        setYears(logsYears)

        setDataLoading(false)
      } catch (error) {
        console.error(error)
        setError('Error fetching poop logs')
      }
    }

    fetchPoopLogs()
  }, [user])

  useEffect(() => {
    if (!poopLogs) {
      return
    }

    let filteredLogs = poopLogs

    if (selectedMonth !== 'all') {
      filteredLogs = filteredLogs.filter(
        (log) => format(log.date, 'MMM').toLowerCase() === selectedMonth
      )
    }

    if (selectedYear !== 'all') {
      filteredLogs = filteredLogs.filter(
        (log) => getYear(log.date).toString() === selectedYear
      )
    }

    setFilteredPoopLogs(filteredLogs)
  }, [selectedMonth, selectedYear, poopLogs])

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
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value='all'>All</option>
                {months.length > 0 &&
                  months.map((month, idx) => (
                    <option key={idx} value={month.toLowerCase().slice(0, 3)}>
                      {month}
                    </option>
                  ))}
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
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value='all'>All</option>
                {years.length > 0 &&
                  years.map((year, idx) => (
                    <option key={idx} value={year}>
                      {year}
                    </option>
                  ))}
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
            {filteredPoopLogs && filteredPoopLogs.length > 0 ? (
              filteredPoopLogs.map((poopLog) => (
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
            ) : dataLoading ? (
              <h1>Data is loading...</h1>
            ) : (
              <h1>No poop logs found.</h1>
            )}
          </ul>
        </section>
      </main>
    </>
  )
}
