import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      {/* Header */}
      <header style={{backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb'}}>
        <div className="container" style={{padding: '1rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>📊 Dashboard</h1>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <span>Welcome, {session.user?.name || session.user?.email}</span>
              <Link href="/profile" style={{color: '#2563eb', textDecoration: 'none'}}>
                Profile
              </Link>
              <Link href="/" style={{color: '#2563eb', textDecoration: 'none'}}>
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{padding: '2rem 1rem'}}>
        <div style={{backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>
            Welcome to your Dashboard!
          </h2>
          <p style={{color: '#4b5563', marginBottom: '1.5rem'}}>
            This is a protected route that only authenticated users can access.
          </p>
          
          <div style={{backgroundColor: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem'}}>
            <h3 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>Your Account Info</h3>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: '0.5rem'}}>
                <strong>Email:</strong> {session.user?.email}
              </li>
              <li style={{marginBottom: '0.5rem'}}>
                <strong>Name:</strong> {session.user?.name || 'Not set'}
              </li>
              <li>
                <strong>Role:</strong> {session.user?.role || 'user'}
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
