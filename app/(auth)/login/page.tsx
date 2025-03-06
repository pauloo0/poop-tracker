import Form from 'next/form'
import Link from 'next/link'
import { loginUser } from './actions'

export default function Login() {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  return (
    <Form action={loginUser} className='flex flex-col gap-6 w-full sm:w-96 p-6'>
      <div className={input_group}>
        <label htmlFor='username' className={input_group_label}>
          Username
        </label>
        <input
          type='text'
          id='username'
          name='username'
          placeholder='Username'
          className={input_group_input}
        />
      </div>

      <div className={input_group}>
        <label htmlFor='password' className={input_group_label}>
          Password
        </label>
        <input
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          className={input_group_input}
        />
      </div>

      <button className='bg-primary text-foreground py-2 rounded-md'>
        Login
      </button>
      <p>
        {`Don't have an account? `}{' '}
        <Link className='text-primary hover:underline' href={`/register`}>
          Create an account.
        </Link>
      </p>
    </Form>
  )
}
