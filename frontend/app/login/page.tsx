"use client";
import "@/app/globals.css";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebaseConfig"; // ⬅️ Import the auth object
import { signInWithEmailAndPassword } from "firebase/auth"; // ⬅️ Import the function

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // for error display (optional)

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      console.warn("Login failed:", err.message || err);
      setError("Invalid email or password"); // Or use err.message
    }
  };

  const handleSignupRedirect = () => {
    router.push("/signup"); // Navigate to /signup page
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="default" onClick={handleLogin}>
            Log In
          </Button>

          {/* Show error if there is one */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Sign up link */}
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={handleSignupRedirect}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
