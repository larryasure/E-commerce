import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState()
  return (
    <div>PaymentCallback</div>
  )
}
