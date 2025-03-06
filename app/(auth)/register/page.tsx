import Form from 'next/form'
import { createUser } from './actions'

export default function Register() {
  const input_group = 'flex flex-col'
  const input_group_label = 'px-1 text-foreground'
  const input_group_input = 'bg-background py-2 px-3 border-b-2 border-primary'

  return (
    <Form
      action={createUser}
      className='flex flex-col gap-6 w-full sm:w-96 p-6'
    >
      <div className={input_group}>
        <label htmlFor='firstname' className={input_group_label}>
          Firstname
        </label>
        <input
          type='text'
          id='firstname'
          name='firstname'
          placeholder='First name'
          className={input_group_input}
        />
      </div>

      <div className={input_group}>
        <label htmlFor='lastname' className={input_group_label}>
          Lastname
        </label>
        <input
          type='text'
          id='lastname'
          name='lastname'
          placeholder='Last name'
          className={input_group_input}
        />
      </div>

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
        <label htmlFor='email' className={input_group_label}>
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          placeholder='example@email.com'
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
          placeholder='First name'
          className={input_group_input}
        />
      </div>

      <div className={input_group}>
        <label htmlFor='confirm_password' className={input_group_label}>
          Confirm Password
        </label>
        <input
          type='confirm_password'
          id='confirm_password'
          name='confirm_password'
          placeholder='Confirm Password'
          className={input_group_input}
        />
      </div>

      <button
        type='submit'
        className='bg-primary text-foreground p-2 rounded-2xl'
      >
        Register
      </button>
    </Form>
  )
}
