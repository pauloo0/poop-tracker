'use server'

import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  updateDoc,
  where,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { Competition, User } from '@/app/lib/types'
import { generateRandomString } from '@/app/lib/utils'
import { format } from 'date-fns'

export async function getCompetitions(userId: string): Promise<{
  success: boolean
  data?: Competition[]
  error?: string
}> {
  try {
    if (!userId) {
      return { success: false, error: 'UserID not provided' }
    }

    // Step 1: Query competitions where the user is a member
    const competitionsQuery = query(
      collection(db, 'competitions'),
      where('members', 'array-contains', { id: userId })
    )
    const competitionsSnapshot = await getDocs(competitionsQuery)

    const competitions: Competition[] = competitionsSnapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    ) as Competition[]

    // Step 3: Collect all unique member IDs across all competitions
    const allMemberIds = new Set<string>()
    competitions.forEach((competition) => {
      competition.members.forEach((member) => allMemberIds.add(member.id))
    })
    const memberIdsArray = [...allMemberIds]

    // Step 4: Fetch user details for all member IDs
    const usersMap: Map<string, { firstname: string; lastname: string }> =
      new Map()
    if (memberIdsArray.length > 0) {
      const chunkSize = 10 // Firestore 'in' query limit
      for (let i = 0; i < memberIdsArray.length; i += chunkSize) {
        const chunk = memberIdsArray.slice(i, i + chunkSize)
        const usersQuery = query(
          collection(db, 'users'),
          where('__name__', 'in', chunk)
        )
        const usersSnapshot = await getDocs(usersQuery)
        usersSnapshot.forEach((doc) => {
          const userData = doc.data() as User
          usersMap.set(doc.id, {
            firstname: userData.firstname,
            lastname: userData.lastname,
          })
        })
      }
    }

    // Step 5: Fetch poopLogs counts for each member per competition
    const enrichedCompetitions = await Promise.all(
      competitions.map(async (competition) => {
        const startDate = competition.startDate // e.g., '2025-03-01'
        const endDate = competition.endDate // e.g., '2025-03-31'

        // Fetch poopLogs for all members in this competition's date range
        const memberIds = competition.members.map((m) => m.id)
        const poopCountsMap = new Map<string, number>()

        if (memberIds.length > 0) {
          const chunkSize = 10 // Batch poopLogs queries due to 'in' limit
          for (let i = 0; i < memberIds.length; i += chunkSize) {
            const chunk = memberIds.slice(i, i + chunkSize)
            const poopLogsQuery = query(
              collection(db, 'poopLogs'),
              where('userId', 'in', chunk),
              where('date', '>=', startDate),
              where('date', '<=', endDate)
            )
            const poopLogsSnapshot = await getDocs(poopLogsQuery)

            poopLogsSnapshot.forEach((doc) => {
              const poopData = doc.data()
              const currentCount = poopCountsMap.get(poopData.userId) || 0
              poopCountsMap.set(poopData.userId, currentCount + 1)
            })
          }
        }

        // Step 6: Enrich members with fullname and poopCount
        const enrichedMembers = competition.members.map((member) => ({
          ...member,
          fullname: usersMap.has(member.id)
            ? `${usersMap.get(member.id)!.firstname} ${
                usersMap.get(member.id)!.lastname
              }`
            : undefined,
          score: poopCountsMap.get(member.id) || 0, // Default to 0 if no logs
        }))

        return {
          ...competition,
          members: enrichedMembers,
        }
      })
    )

    return { success: true, data: enrichedCompetitions }
  } catch (error) {
    console.error('Error in getCompetitions:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function updateCompetitionName(
  userId: string,
  competitionId: string,
  competitionName: string
) {
  if (!userId) throw new Error('UserID not provided.')

  try {
    const competitionRef = doc(db, 'competitions', competitionId)

    await updateDoc(competitionRef, {
      name: competitionName,
    })
    return { success: true, message: 'Competition name updated.' }
  } catch (error) {
    console.error('Error occured on updateCompetitionName: ', error)
    throw error
  }
}

export async function removeCompetitionMember(
  userId: string,
  competitionId: string,
  memberId: string
) {
  if (!userId || !competitionId || !memberId)
    throw new Error("Couldn't get member data.")

  try {
    const competitionRef = doc(db, 'competitions', competitionId)
    const competitionSnap = await getDoc(competitionRef)

    if (!competitionSnap.exists()) {
      throw new Error('Competition not found.')
    }

    const competitionData = competitionSnap.data() as Competition
    if (competitionData.createdBy !== userId) {
      throw new Error('Unauthorized!')
    }

    const memberExists = competitionData.members.find(
      (member) => member.id === memberId
    )
    if (!memberExists) {
      throw new Error("This member doesn't exist.")
    }

    const updatedMembers = competitionData.members.filter(
      (member) => member.id !== memberId
    )

    await updateDoc(competitionRef, {
      members: updatedMembers,
    })

    return { success: true, message: 'Member was removed successfully.' }
  } catch (error) {
    console.error('Error occured on removeCompetitionMember: ', error)
    throw error
  }
}

export async function createInvitation(userId: string, competitionId: string) {
  if (!userId || !competitionId) throw new Error("Couldn't get member data.")

  const token = generateRandomString(20)
  const inviteLink = `https://localhost:3000/invitations/${token}`

  const newInvitation = {
    competitionId: competitionId,
    token: token,
    date: format(new Date(), 'yyyy-MM-dd'),
    expirationSeconds: 900,
  }

  try {
    const invitationRef = doc(collection(db, 'invitations'))
    await setDoc(invitationRef, newInvitation)

    return { success: true, link: inviteLink }
  } catch (error) {
    console.error('Error occured on createInvitation: ', error)
    throw error
  }
}
