import Navbar from '../components/Navbar'

export default function Dashboard() {
  return (
    <>
      <Navbar active='home' />
      <main className='mt-12 p-6'>
        <h1 className='text-xl'>
          Hello, <span className='font-bold'>Paulo</span>
        </h1>

        <section id='stats' className='my-14 grid grid-cols-2 gap-x-4 gap-y-8'>
          <div className='flex flex-col items-center'>
            <h2 className='text-lg font-bold'>Month</h2>
            <p className='text-xl'>16</p>
          </div>
          <div className='flex flex-col items-center'>
            <h2 className='text-lg font-bold'>Year</h2>
            <p className='text-xl'>80</p>
          </div>

          <div className='flex flex-col items-center'>
            <h2 className='text-lg font-bold'>Daily Record</h2>
            <p className='text-xl'>3</p>
            <span className='text-sm'>on Jan 8th, 2025</span>
          </div>
          <div className='flex flex-col items-center'>
            <h2 className='text-lg font-bold'>Current Streak</h2>
            <p className='text-xl'>11</p>
          </div>
          <div className='flex flex-col items-center col-span-2'>
            <h2 className='text-lg font-bold'>Highest Streak</h2>
            <p className='text-xl'>16</p>
            <span className='text-sm'>from Jan 4th, 2025 to 19th, 2025</span>
          </div>
        </section>

        <section id='leaderboard'>
          <h2 className='text-lg font-bold mb-1'>Leaderboard</h2>
          <ul>
            <li className='flex flex-row items-center justify-between text-2xl border-b-2 border-b-primary p-2'>
              <div className='flex flex-row items-center gap-4'>
                <span>1</span> André Costa
              </div>
              <span>82</span>
            </li>
            <li className='flex flex-row items-center justify-between text-xl border-b-2 border-b-primary p-2'>
              <div className='flex flex-row items-center gap-4'>
                <span>2</span> Paulo Oliveira
              </div>
              <span>80</span>
            </li>
            <li className='flex flex-row items-center justify-between text-lg border-b-2 border-b-primary p-2'>
              <div className='flex flex-row items-center gap-4'>
                <span>3</span> André Silva
              </div>
              <span>71</span>
            </li>
            <li className='flex flex-row items-center justify-between text-base border-b-2 border-b-primary p-2'>
              <div className='flex flex-row items-center gap-4'>
                <span>4</span> João Machado
              </div>
              <span>68</span>
            </li>
            <li className='flex flex-row items-center justify-between text-base border-b-2 border-b-primary p-2'>
              <div className='flex flex-row items-center gap-4'>
                <span>5</span> Rui Oliveira
              </div>
              <span>66</span>
            </li>
          </ul>
        </section>
      </main>
    </>
  )
}
