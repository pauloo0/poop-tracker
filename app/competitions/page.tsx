'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/app/components/Loading'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuthState } from '@/app/hooks/useAuthState'
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect'
import { Competition } from '@/app/lib/types'
import {
  getCompetitions,
  updateCompetitionName,
} from '@/app/competitions/actions'

export default function Competitions() {
  const { loading: authLoading, user } = useAuthState()
  useAuthRedirect({ loading: authLoading, user })

  const router = useRouter()
  const searchParams = useSearchParams()
  const competitionId = searchParams.get('competition') || 'none'

  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState<boolean>(true)
  const [competitions, setCompetitions] = useState<Competition[] | null>(null)

  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null)

  const [competitionName, setCompetitionName] = useState<string>('')
  const [canEditCompetition, setCanEditCompetition] = useState<boolean>(false)
  const [isEditingCompetitionName, setIsEditingCompetitionName] =
    useState(false)
  const [showCompetitionMembers, setShowCompetitionMembers] =
    useState<boolean>(false)

  useEffect(() => {
    if (!user) return

    const fetchCompetition = async () => {
      try {
        const userId: string = user.uid
        const resCompetition = await getCompetitions(userId)
        const { success, data } = resCompetition

        if (!success || !data) throw new Error('Competition not found.')

        setCompetitions(data)
        setDataLoading(false)
      } catch (error) {
        console.error(error)
        setError('Error fetching competition data')
      }
    }

    fetchCompetition()
  }, [user, competitionId])

  useEffect(() => {
    if (!user || !competitions) return

    const selectedCompetition = competitions.find(
      (competition) => competition.id === competitionId
    )

    if (selectedCompetition) {
      setSelectedCompetition(selectedCompetition)
      setCanEditCompetition(selectedCompetition.createdBy === user.uid)
      setCompetitionName(selectedCompetition.name)
    }
  }, [user, competitions, competitionId])

  const handleShowMembers = () => {
    if (!competitionId) return

    setShowCompetitionMembers(!showCompetitionMembers)
  }

  const handleCompetitionEdit = async (competitionId: string) => {
    if (!user || !competitionId) return
    const userId = user.uid

    try {
      setDataLoading(true)

      const resUpdate = await updateCompetitionName(
        userId,
        competitionId,
        competitionName
      )

      if (!resUpdate.success) {
        setError("Couldn't update the competition's name.")
      } else {
        setIsEditingCompetitionName(false)
        setCompetitions((prev) => {
          if (!prev) return null

          const newComps = prev.map((competition) => {
            if (competition.id === competitionId) {
              return { ...competition, name: competitionName }
            } else {
              return { ...competition }
            }
          })

          return newComps
        })
      }
    } catch (error) {
      console.error(error)
      setError('Error editing competition name.')
    } finally {
      setDataLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!competitionId || !memberId) return

    console.log(
      'Remove member id: ' + memberId + ' from competition: ' + competitionId
    )
  }

  if (dataLoading) return <Loading />

  return (
    <main className='p-6 pb-[80px] min-h-screen'>
      <section
        id='filters'
        className='flex flex-col items-center justify-between w-full gap-4 sm:items-end sm:flex-row my-14'
      >
        <div className='flex flex-col w-full sm:w-96'>
          <label htmlFor='competition' className='px-1 text-foregroung'>
            Competition
          </label>
          <select
            name='competition'
            id='competition'
            className='px-3 py-2 border-2 rounded-md bg-background border-primary'
            value={competitionId}
            onChange={(e) =>
              router.push(`/competitions?competition=${e.target.value}`)
            }
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

        <Link
          href='/competitions/new'
          className='flex flex-row items-center justify-center w-full px-3 py-2 rounded-md bg-primary text-foreground sm:w-48'
        >
          <Plus className='w-4 h-4 mr-2' /> New competition
        </Link>
      </section>

      {error && <h1 className='text-lg'>{error}</h1>}

      {competitionId !== 'none' ? (
        <section id='competition'>
          <div className='flex flex-row items-center justify-start gap-3'>
            {isEditingCompetitionName ? (
              <div className='flex flex-col items-center justify-start gap-2'>
                <input
                  type='text'
                  value={competitionName}
                  onChange={(e) => setCompetitionName(e.target.value)}
                  name='competition-name'
                  className='text-2xl border-b-2 bg-background border-primary'
                />
                <div className='flex flex-row items-center justify-between w-full gap-2'>
                  <button
                    className='flex-1 py-1 rounded-md bg-primary text-foreground'
                    onClick={() => handleCompetitionEdit(competitionId)}
                  >
                    Save
                  </button>
                  <button
                    className='flex-1 py-1 rounded-md text-primary bg-foreground'
                    onClick={() => setIsEditingCompetitionName(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex flex-col sm:flex-row w-full sm:items-center justify-center sm:justify-start gap-4 mb-4'>
                <div className='flex flex-row items-center justify-center gap-4'>
                  <h2 className='text-2xl'>{competitionName}</h2>
                  {canEditCompetition && (
                    <button onClick={() => setIsEditingCompetitionName(true)}>
                      <Pencil className='w-4 h-4' />
                    </button>
                  )}
                </div>
                <button
                  className='bg-primary px-4 py-2 rounded-md'
                  onClick={() => handleShowMembers()}
                >
                  {showCompetitionMembers ? 'Hide' : 'Show'} Members
                </button>
              </div>
            )}
          </div>

          {!showCompetitionMembers ? (
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse rounded-lg shadow-md'>
                <thead>
                  <tr className='text-lg text-foreground'>
                    <th className='w-1/6 p-3 font-semibold text-left'>Rank</th>
                    <th className='w-3/6 p-3 font-semibold text-left'>Name</th>
                    <th className='w-2/6 p-3 font-semibold text-right'>
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCompetition &&
                  selectedCompetition.members.length > 0 ? (
                    selectedCompetition.members
                      .sort((a, b) => (b.score || 0) - (a.score || 0))
                      .map((member, idx) => (
                        <tr
                          key={idx}
                          className={`${
                            idx === 0
                              ? 'text-2xl'
                              : idx === 1
                              ? 'text-xl'
                              : idx === 2
                              ? 'text-lg'
                              : 'text-base'
                          } border-b border-b-orange-200 border-opacity-20`}
                        >
                          <td className='p-3 text-left'>{idx + 1}</td>
                          <td className='p-3 text-left'>
                            {member.fullname || 'Unknown User'}
                          </td>
                          <td className='p-3 text-right'>
                            {member.score || '0'}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={3} className='p-3 text-center'>
                        No members in this competition
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse rounded-lg shadow-md'>
                <thead>
                  <tr className='text-lg text-foreground'>
                    <th className='w-2/3 p-3 font-semibold text-left'>Name</th>
                    {canEditCompetition && (
                      <th className='w-1/3 p-3 font-semibold text-right'>
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {selectedCompetition &&
                  selectedCompetition.members.length > 0 ? (
                    selectedCompetition.members
                      .sort((a, b) => (b.score || 0) - (a.score || 0))
                      .map((member, idx) => (
                        <tr
                          key={idx}
                          className='border-b border-b-orange-200 border-opacity-20 text-lg'
                        >
                          <td className='p-3 text-left'>
                            {member.fullname || 'Unknown User'}
                          </td>
                          {canEditCompetition && (
                            <td className='p-3 flex items-center justify-end'>
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                <Trash2 className='w-5 h-5' />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={3} className='p-3 text-center'>
                        No members in this competition
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <p>No competition selected or available</p>
      )}
    </main>
  )
}
