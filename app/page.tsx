import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      {/* Header */}
      <header style={{backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb'}}>
        <div className="container" style={{padding: '1rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>🏠 My App</h1>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              {session ? (
                <>
                  <span>Welcome, {session.user?.name || session.user?.email}</span>
                  <Link href="/dashboard" style={{color: '#2563eb', textDecoration: 'none'}}>
                    Dashboard
                  </Link>
                  <Link href="/profile" style={{color: '#2563eb', textDecoration: 'none'}}>
                    Profile
                  </Link>
                  <Link href="/api/auth/signout" style={{color: '#2563eb', textDecoration: 'none'}}>
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" style={{color: '#2563eb', textDecoration: 'none'}}>
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{padding: '4rem 1rem', textAlign: 'center'}}>
        <div className="container">
          <h2 style={{fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem'}}>
            Welcome to My App
          </h2>
          <p style={{fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem'}}>
            A Next.js application with authentication and dashboard
          </p>

          {session ? (
            <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap'}}>
              <Link href="/dashboard" style={{padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#ffffff', textDecoration: 'none', borderRadius: '0.375rem', fontWeight: '500'}}>
                Go to Dashboard
              </Link>
              <Link href="/profile" style={{padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: '#ffffff', textDecoration: 'none', borderRadius: '0.375rem', fontWeight: '500'}}>
                View Profile
              </Link>
            </div>
          ) : (
            <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap'}}>
              <Link href="/login" style={{padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#ffffff', textDecoration: 'none', borderRadius: '0.375rem', fontWeight: '500'}}>
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div style={{marginTop: '4rem', maxWidth: '800px', margin: '4rem auto 0'}}>
          <div style={{display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
            <div style={{backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>🔐 Secure Login</h3>
              <p style={{color: '#6b7280'}}>Email and password authentication using bcrypt and JWT</p>
            </div>
            <div style={{backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>📊 Dashboard</h3>
              <p style={{color: '#6b7280'}}>Protected route accessible only to authenticated users</p>
            </div>
            <div style={{backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>👤 Profile</h3>
              <p style={{color: '#6b7280'}}>Update your name and change your password</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
