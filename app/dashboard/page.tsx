'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'
import Loading from '@/app/components/Loading'
import { getDashboardData } from '@/app/dashboard/actions'
import { getUserData } from '@/app/profile/actions'
import { getCompetitions } from '@/app/competitions/actions'
import { Competition } from '@/app/lib/types'

export default function Dashboard() {
  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState<boolean>(true)
  const [userFullname, setUserFullname] = useState<string>('')

  const [monthlyPoops, setMonthlyPoops] = useState<number>(0)
  const [yearlyPoops, setYearlyPoops] = useState<number>(0)
  const [currentStreak, setCurrentStreak] = useState<number>(0)
  const [highestStreak, setHighestStreak] = useState<number>(0)
  const [dailyRecord, setDailyRecord] = useState<number>(0)
  const [dailyRecordDate, setDailyRecordDate] = useState<string>('')
  const [highestStreakDate, setHighestStreakDate] = useState<string>('')

  const [competitions, setCompetitions] = useState<Competition[] | null>(null)
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchDashboardData = async () => {
      setDataLoading(true)

      try {
        const resDashboard = await getDashboardData(user.uid)
        const { success, data } = resDashboard

        if (!success) throw new Error('Error fetching dashboardData')

        setMonthlyPoops(data.monthlyPoops)
        setYearlyPoops(data.yearlyPoops)
        setDailyRecord(data.dailyRecord)
        setDailyRecordDate(data.dailyRecordDate)
        setCurrentStreak(data.currentStreak)
        setHighestStreak(data.highestStreak)
        setHighestStreakDate(data.highestStreakDate)

        setDataLoading(false)
      } catch (error) {
        console.error(error)
        setError('Error fetching poop logs')
      }
    }

    const fetchUserData = async () => {
      setDataLoading(true)

      try {
        const resUser = await getUserData(user.uid)
        const { success, data } = resUser

        if (!success) throw new Error('Error fetching userData')

        setUserFullname(data.fullname)
      } catch (error) {
        console.error(error)
        setError('Error fetching user info')
      }
    }

    const fetchCompetitionData = async () => {
      setDataLoading(true)

      try {
        const resCompetitions = await getCompetitions(user.uid)
        const { success, data } = resCompetitions

        if (!success || !data) throw new Error('Competition not found.')

        setCompetitions(data)
        setDataLoading(false)
      } catch (error) {
        console.error(error)
        setError('Error fetching competition info')
      }
    }

    fetchDashboardData()
    fetchUserData()
    fetchCompetitionData()
  }, [user])

  const handleCompetitionChange = (competitionId: string) => {
    if (!competitions) return

    const comp = competitions.find(
      (competition) => competition.id === competitionId
    )

    if (!comp) return

    setSelectedCompetition(comp)
  }

  if (dataLoading) return <Loading />

  if (error) {
    return <h1 className='text-2xl'>{error}</h1>
  }

  return (
    <>
      <main className='mt-12 p-6'>
        <h1 className='text-xl'>
          Hello, <span className='font-bold'>{userFullname}</span>
        </h1>

        <section id='stats' className='my-14 grid grid-cols-2 gap-x-4 gap-y-8'>
          <div className='flex flex-col items-center'>
            <h2 className='text-lg font-bold'>Month</h2>
            <p className='text-xl'>{monthlyPoops}</p>
          </div>
          <div className='flex flex-col items-center'>
            <h2 className='text-lg font-bold'>Year</h2>
            <p className='text-xl'>{yearlyPoops}</p>
          </div>

          <div className='flex flex-col items-center'>
            <h2 className='text-lg font-bold'>Daily Record</h2>
            <p className='text-xl'>{dailyRecord}</p>
            <span className='text-sm'>{dailyRecordDate}</span>
          </div>
          <div className='flex flex-col items-center'>
            <h2 className='text-lg font-bold'>Current Streak</h2>
            <p className='text-xl'>{currentStreak}</p>
          </div>
          <div className='flex flex-col items-center col-span-2'>
            <h2 className='text-lg font-bold'>Highest Streak</h2>
            <p className='text-xl'>{highestStreak}</p>
            <span className='text-sm'>{highestStreakDate}</span>
          </div>
        </section>

        <section className='grid place-items-center'>
          <Link
            href='/logs/new'
            className='rounded-xl w-full sm:w-48 transition-transform flex items-center justify-center bg-primary text-foreground gap-2 hover:scale-105 text-base h-10 sm:h-12 px-4 sm:px-5'
          >
            Record a poo!
          </Link>
        </section>

        <section id='leaderboard' className='mt-8'>
          <div className='flex flex-col w-full sm:w-96 mb-2'>
            <label htmlFor='competition' className='text-lg font-bold mb-1'>
              Competition
            </label>
            <select
              name='competition'
              id='competition'
              className='px-3 py-2 border-2 rounded-md bg-background border-primary'
              value={selectedCompetition ? selectedCompetition.id : 'none'}
              onChange={(e) => handleCompetitionChange(e.target.value)}
            >
              <option value='none'>Select Competition</option>
              {competitions &&
                competitions.map((competition) => (
                  <option key={competition.id} value={competition.id}>
                    {competition.name}
                  </option>
                ))}
            </select>
          </div>
          {selectedCompetition && (
            <ul>
              {selectedCompetition.members.length > 0 ? (
                <>
                  {selectedCompetition.members
                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                    .slice(0, 3)
                    .map((member, idx) => (
                      <li
                        key={idx}
                        className={`flex flex-row items-center justify-between border-b border-b-orange-200 border-opacity-20 p-2 ${
                          idx === 0
                            ? 'text-2xl'
                            : idx === 1
                            ? 'text-xl'
                            : 'text-lg'
                        }`}
                      >
                        <div className='flex flex-row items-center gap-4'>
                          <span>{idx + 1}</span>
                          {member.fullname || 'Unknown User'}
                        </div>
                        <span>{member.score || 0}</span>
                      </li>
                    ))}
                  <li className='flex flex-row items-center justify-between text-lg p-2'>
                    <Link
                      href={`/competitions?competition=${selectedCompetition.id}`}
                    >
                      See more...
                    </Link>
                  </li>
                </>
              ) : (
                <li>No members in this competition</li>
              )}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}
// ;<>
//   <li className='flex flex-row items-center justify-between text-2xl border-b-2 border-b-primary p-2'>
//     <div className='flex flex-row items-center gap-4'>
//       <span>1</span> André Costa
//     </div>
//     <span>82</span>
//   </li>
//   <li className='flex flex-row items-center justify-between text-xl border-b-2 border-b-primary p-2'>
//     <div className='flex flex-row items-center gap-4'>
//       <span>2</span> Paulo Oliveira
//     </div>
//     <span>80</span>
//   </li>
//   <li className='flex flex-row items-center justify-between text-lg p-2'>
//     <div className='flex flex-row items-center gap-4'>
//       <span>3</span> André Silva
//     </div>
//     <span>71</span>
//   </li>
//   <li className='flex flex-row items-center justify-between text-lg p-2'>
//     <Link href={`/competitions?competition=${selectedCompetition.id}`}>
//       See more...
//     </Link>
//   </li>
// </>
