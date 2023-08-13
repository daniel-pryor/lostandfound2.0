'use client'

import { experimental_useFormStatus as useFormStatus } from 'react-dom'

const ButtonSubmit = ({ value, ...props }: any) => {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} {...props}>
      {pending ? 'Loading...' : value}
    </button>
  )
}

export default ButtonSubmit
