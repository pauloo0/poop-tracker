import Form from 'next/form'
import { createUser } from './actions'

export default function Register() {
  return (
    <Form action={createUser}>
      <input
        type='text'
        id='firstname'
        name='firstname'
        placeholder='First name'
      />
      <input
        type='text'
        id='lastname'
        name='lastname'
        placeholder='Last name'
      />
      <input type='text' id='username' name='username' placeholder='Username' />
      <input type='email' id='email' name='email' placeholder='Email' />
      <input
        type='password'
        id='password'
        name='password'
        placeholder='Password'
      />
      <input
        type='password'
        id='confirm_password'
        name='confirm_password'
        placeholder='Confirm password'
      />

      <button type='submit'>Register</button>
    </Form>
  )
}
