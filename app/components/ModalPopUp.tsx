'use client'

import { useEffect, useRef, useState } from 'react'

interface ModalProps {
  title: string
  message: string
  isOpen: boolean
  onClose: () => void
}

function ModalPopUp({ title, message, isOpen, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [textCopied, setTextCopied] = useState<boolean>(false)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen])

  const copyText = () => {
    //TODO Copy message to clipboard
    setTextCopied(true)
  }

  useEffect(() => {
    setTimeout(() => setTextCopied(false), 1000)
  }, [textCopied])

  return (
    <dialog
      ref={dialogRef}
      className='rounded-lg p-6 backdrop:bg-gray-800/50 bg-zinc-800 text-foreground'
      onClose={onClose}
    >
      <div className='max-w-md mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>{title}</h1>
        <p className='mb-4'>{message}</p>
        <div className='flex flex-row items-center justify-center gap-4'>
          <button
            disabled={textCopied}
            onClick={copyText}
            className={`py-2 px-4 ${
              textCopied ? 'opacity-45' : ''
            } bg-zinc-700 rounded-md`}
          >
            {textCopied ? 'Copied...' : 'Copy link'}
          </button>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-primary text-foreground rounded-md '
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default ModalPopUp
