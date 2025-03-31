'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import Loading from '@/app/components/Loading'
import { PoopLog } from '@/app/lib/types'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'
import { getPoopLogs, deletePoopLog } from '@/app/logs/actions'
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

  const handleDeletePoopLog = async (poopLogId: string | undefined) => {
    if (!user || !poopLogId) return
    const userId = user.uid

    try {
      setDataLoading(true)

      const resDelete = await deletePoopLog(userId, poopLogId)

      if (!resDelete.success) {
        setError("Couldn't delete the poop log.")
      } else {
        setPoopLogs((prevLogs) => {
          return prevLogs
            ? prevLogs.filter((log) => log.id !== poopLogId)
            : null
        })
        setFilteredPoopLogs((prevLogs) => {
          return prevLogs
            ? prevLogs.filter((log) => log.id !== poopLogId)
            : null
        })
      }
    } catch (error) {
      console.error(error)
      setError('Error deleting poop log.')
    } finally {
      setDataLoading(false)
    }
  }

  if (error) {
    return <h1 className='text-2xl'>{error}</h1>
  }

  if (dataLoading) return <Loading />

  return (
    <main className='p-6 pb-[80px] min-h-screen'>
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
          href='/logs/new'
          className='flex flex-row items-center justify-center w-full px-3 py-2 rounded-md bg-primary text-foreground sm:w-48'
        >
          Log poop
        </Link>
      </section>

      <section id='logs' className='overflow-x-auto'>
        <table className='w-full border-collapse rounded-lg shadow-md'>
          <thead>
            <tr className='text-lg text-foreground'>
              <th className='p-2 sm:p-3 font-semibold text-center'>Year</th>
              <th className='p-2 sm:p-3 font-semibold text-center'>Month</th>
              <th className='p-2 sm:p-3 font-semibold text-center'>Day</th>
              <th className='p-2 sm:p-3 font-semibold text-center'>Time</th>
              <th className='p-2 sm:p-3 font-semibold text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPoopLogs && filteredPoopLogs.length > 0 ? (
              filteredPoopLogs.map((poopLog) => (
                <tr
                  key={poopLog.id}
                  className='border-b border-b-orange-200 border-opacity-20'
                >
                  <td className='p-2 sm:p-3 text-center'>
                    {format(new Date(poopLog.date), 'yyyy')}
                  </td>
                  <td className='p-2 sm:p-3 text-center'>
                    {format(new Date(poopLog.date), 'MMMM')}
                  </td>
                  <td className='p-2 sm:p-3 text-center'>
                    {format(new Date(poopLog.date), 'dd')}
                  </td>
                  <td className='p-2 sm:p-3 text-center'>{poopLog.time}</td>
                  <td className='p-2 sm:p-3 flex items-center justify-end gap-4'>
                    <Link href={`/logs/edit/${poopLog.id}`}>
                      <Pencil className='h-5 w-5' />
                    </Link>
                    <button onClick={() => handleDeletePoopLog(poopLog.id)}>
                      <Trash2 className='h-5 w-5' />
                    </button>
                  </td>
                </tr>
              ))
            ) : dataLoading ? (
              <tr>
                <td colSpan={3} className='p-3 text-center'>
                  Data is loading...
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={3} className='p-3 text-center'>
                  No poop logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}
