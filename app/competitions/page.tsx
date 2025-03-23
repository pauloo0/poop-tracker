'use client'

import { Pencil, Plus } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function Competitions() {
  const searchParams = useSearchParams()
  const initialCompetition = searchParams.get('competition') || 'none'

  const [selectedCompetition, setSelectedCompetition] =
    useState<string>(initialCompetition)
  const [competitionName, setCompetitionName] =
    useState<string>('Poopions League')
  const [isEditingCompetitionName, setIsEditingCompetitionName] =
    useState(false)

  return (
    <>
      <main className='p-6'>
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
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
            >
              <option value='none'>Select Competition</option>
              <option value='id123'>Poopions League</option>
              <option value='id456'>New competition</option>
            </select>
          </div>

          <Link
            href='/competitions/new'
            className='flex flex-row items-center justify-center w-full px-3 py-2 rounded-md bg-primary text-foreground sm:w-48'
          >
            <Plus className='w-4 h-4 mr-2' /> New competition
          </Link>
        </section>

        <section id='leaderboard2'>
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
                  <button className='flex-1 py-1 rounded-md bg-primary text-foreground'>
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
              <>
                <h2 className='text-2xl'>Poopions League</h2>
                <button onClick={() => setIsEditingCompetitionName(true)}>
                  <Pencil className='w-4 h-4' />
                </button>
              </>
            )}
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse rounded-lg shadow-md'>
              <thead>
                <tr className='text-lg text-foreground'>
                  <th className='w-1/6 p-3 font-semibold text-left'>Rank</th>
                  <th className='w-3/6 p-3 font-semibold text-left'>Name</th>
                  <th className='w-2/6 p-3 font-semibold text-right'>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className='text-2xl border-b border-b-orange-200 border-opacity-20'>
                  <td className='p-3 text-left'>1</td>
                  <td className='p-3 text-lef'>John Doe</td>
                  <td className='p-3 text-right'>42</td>
                </tr>
                <tr className='text-xl border-b border-b-orange-200 border-opacity-20'>
                  <td className='p-3 text-left'>2</td>
                  <td className='p-3 text-lef'>Jane Smith</td>
                  <td className='p-3 text-right'>38</td>
                </tr>
                <tr className='text-lg border-b border-b-orange-200 border-opacity-20'>
                  <td className='p-3 text-left'>3</td>
                  <td className='p-3 text-lef'>Bob Johnson</td>
                  <td className='p-3 text-right'>35</td>
                </tr>
                <tr className='text-base'>
                  <td className='p-3 text-left'>3</td>
                  <td className='p-3 text-lef'>Bob Johnson</td>
                  <td className='p-3 text-right'>35</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  )
}
