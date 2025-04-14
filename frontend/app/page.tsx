'use client'

import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import { useState } from 'react'
import "@/app/globals.css"

export default function Page() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/homepage')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSignUp = () => {
    router.push('/signup')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-xl font-semibold">Login</h1>

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

      <div className="flex space-x-4">
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Login
        </button>
        <button
          onClick={handleSignUp}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Sign Up
        </button>
      </div>
    </main>
  )
}
