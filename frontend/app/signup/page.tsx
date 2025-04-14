'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import "@/app/globals.css"

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCreateAccount = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/') // redirect to login page
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-2xl font-bold">Create Your Account</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 border rounded w-64"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 border rounded w-64"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleCreateAccount}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Create Account
      </button>
    </main>
  )
}
