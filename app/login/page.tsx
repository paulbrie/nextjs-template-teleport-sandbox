'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error === 'CredentialsSignin' ? 'Invalid email or password' : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setErrorMessage('Invalid email or password');
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6'}}>
      <div style={{width: '100%', maxWidth: '400px', padding: '2rem'}}>
        <div style={{backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
          <h1 style={{textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem'}}>
            🔐 Login
          </h1>

          {errorMessage && (
            <div style={{backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#dc2626', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem'}}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
              />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151'}}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{width: '100%', padding: '0.75rem', backgroundColor: isLoading ? '#9ca3af' : '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.375rem', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: '500'}}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
            <Link href="/" style={{color: '#2563eb', textDecoration: 'none'}}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6'}}>
        <p>Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
