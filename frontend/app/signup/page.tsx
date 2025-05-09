"use client";
import "@/app/globals.css";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    try {
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // redirect to home on successful signup
    } catch (err: any) {
      console.warn("Signup error:", err.message || err);
      setError(err.message || "Signup failed");
    }
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
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
          <Button variant="default" onClick={handleSignup}>
            Sign Up
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={handleLoginRedirect}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
