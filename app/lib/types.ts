export interface User {
  id: string
  email: string
  firstname: string
  lastname: string
  createdAt: string
}

export interface PoopLog {
  id?: string
  userId: string
  date: string
  time: string
  rating?: number
  location?: string
  notes?: string
}

type CompetitionMember = {
  id: string
  fullname?: string
  score?: number
}

export interface Competition {
  id?: string
  name: string
  createdBy: string
  members: CompetitionMember[]
  startDate: string
  endDate: string
  ended: boolean
  winner?: string
}

export interface Invitation {
  id?: string
  competitionId: string
  token: string
  date: string
  expirationSeconds: number
}

export interface RegisterFormErrors {
  firstname?: string[]
  lastname?: string[]
  email?: string[]
  password?: string[]
  confirm_password?: string[]
  general?: string[]
}

export interface PoopLogFormErrors {
  date?: string[]
  time?: string[]
  rating?: string[]
  location?: string[]
  notes?: string[]
  general?: string[]
}

export interface CompetitionFormErrors {
  name?: string[]
  general?: string[]
}
