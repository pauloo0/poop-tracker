'use server'

import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { addSeconds } from 'date-fns'
import { Competition } from '@/app/lib/types'

export async function addUser(token: string, userId: string) {
  if (!userId) throw new Error('UserID not provided.')

  try {
    // Get the invitation document
    const invitationsRef = collection(db, 'invitations')
    const invitationsQuery = query(invitationsRef, where('token', '==', token))
    const invitationsSnapshot = await getDocs(invitationsQuery)

    if (invitationsSnapshot.empty) {
      throw new Error('Invitation not found.')
    }

    const invitationDoc = invitationsSnapshot.docs[0]
    const invitationData = invitationDoc.data()
    const competitionId = invitationData.competitionId
    const expirationDate = addSeconds(
      invitationData.date,
      invitationData.expirationSeconds
    )
    const currentDate = new Date()

    // Check if the invitation is expired
    if (currentDate > expirationDate) {
      return {
        success: false,
        data: {
          error: 'Invitation has expired.',
        },
      }
    }

    // Get the competition document
    const competitionRef = doc(db, 'competitions', competitionId)
    const competitionDoc = await getDoc(competitionRef)

    if (!competitionDoc.exists()) {
      return {
        success: false,
        data: {
          error: 'Competition not found.',
        },
      }
    }

    const competitionData = competitionDoc.data() as Competition
    const competitionMembers = [...competitionData.members]

    // Check if the user is already a member
    const isMember = competitionMembers.find((member) => member.id === userId)
    if (isMember) {
      return {
        success: false,
        data: { error: 'User is already a member of the competition.' },
      }
    }

    // Add the user to the competition
    const updatedMembers = [...competitionMembers, { id: userId }]

    await updateDoc(competitionRef, {
      members: updatedMembers,
    })

    return {
      success: true,
      data: { competitionId: competitionId },
    }
  } catch (error) {
    return {
      success: false,
      data: {
        error: 'Error on invitationsAddUser: , ' + error,
      },
    }
  }
}
