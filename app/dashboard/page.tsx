"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">
                Welcome, {session?.user?.name}
              </span>
              <Link
                href="/profile"
                className="text-blue-400 hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to your Dashboard
            </h2>
            <p className="text-slate-300 mb-6">
              This is a protected page that only logged-in users can access.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">User Info</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300">
                    <span className="font-medium">Name:</span> {session?.user?.name}
                  </p>
                  <p className="text-slate-300">
                    <span className="font-medium">Email:</span> {session?.user?.email}
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="block text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Edit Profile →
                  </Link>
                  <Link
                    href="/"
                    className="block text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Back to Home →
                  </Link>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Logged in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
