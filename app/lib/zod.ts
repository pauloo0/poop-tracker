import { z } from 'zod'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const newUserSchema = z
  .object({
    firstname: z.string().min(1, { message: 'This field is required' }),
    lastname: z.string().min(1, { message: 'This field is required' }),
    email: z
      .string()
      .min(1, { message: 'This field is required' })
      .email({ message: 'This is not a valid email.' }),
    password: z
      .string()
      .min(6, { message: 'Your password is too short.' })
      .regex(passwordRegex, {
        message:
          'Your password is too weak. It must contain at least one upper case letter, one lower case letter, one number and one special character.',
      }),
    confirm_password: z
      .string()
      .min(6, { message: 'Your password is too short.' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  })

export const poopLogSchema = z.object({
  date: z.date(),
  time: z.string().min(1, { message: 'This field is required.' }),
  rating: z
    .number()
    .min(1, { message: 'Rating must be between 1 and 5' })
    .max(5, { message: 'Rating must be between 1 and 5' })
    .optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
})

export const competitionSchema = z.object({
  name: z.string(),
  createdBy: z.string(),
  members: z.string().array(),
  startDate: z.date(),
  endDate: z.date(),
  ended: z.boolean(),
  winner: z.string().optional(),
})
