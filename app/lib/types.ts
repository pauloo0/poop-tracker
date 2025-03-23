export interface User {
  id: string
  email: string
  firstname: string
  lastname: string
  createdAt: string
}

export interface PoopLog {
  id: string
  userId: string
  timestamp: string
  rating?: number
  location?: string
  notes?: string
}

export interface Competition {
  id: string
  name: string
  createdBy: string
  members: string[]
  createdAt: string
  startDate: string
  endDate: string
  winner?: string
}

export interface RegisterFormErrors {
  firstname?: string[]
  lastname?: string[]
  email?: string[]
  password?: string[]
  confirm_password?: string[]
  general?: string[]
}
