import React from 'react'
import { LoaderCircle } from 'lucide-react'

function Loading() {
  return (
    <div className='min-h-screen flex flex-col gap-2 items-center justify-center'>
      <LoaderCircle className='w-12 h-12 animate-spin' />
      Loading ...
    </div>
  )
}

export default Loading
