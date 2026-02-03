'use client';

export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status;
  const update = sessionResult?.update;
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, status, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || 'Failed to update profile');
        return;
      }

      setProfileMessage('Profile updated successfully!');
      update(); // Update session
    } catch (err) {
      setProfileError('An error occurred. Please try again.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || 'Failed to update password');
        return;
      }

      setPasswordMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError('An error occurred. Please try again.');
    }
  };

  if (status === 'loading') {
    return (
      <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      {/* Header */}
      <header style={{backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb'}}>
        <div className="container" style={{padding: '1rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>👤 Profile</h1>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <span>Welcome, {session.user?.name || session.user?.email}</span>
              <Link href="/dashboard" style={{color: '#2563eb', textDecoration: 'none'}}>
                Dashboard
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
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          {/* Update Name Section */}
          <div style={{backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem'}}>
            <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem'}}>
              Update Name
            </h2>
            
            {profileMessage && (
              <div style={{backgroundColor: '#d1fae5', border: '1px solid #059669', color: '#065f46', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem'}}>
                {profileMessage}
              </div>
            )}
            
            {profileError && (
              <div style={{backgroundColor: '#fee2e2', border: '1px solid #dc2626', color: '#991b1b', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem'}}>
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                />
              </div>
              <button type="submit" style={{width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '500'}}>
                Update Name
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div style={{backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem'}}>
              Change Password
            </h2>
            
            {passwordMessage && (
              <div style={{backgroundColor: '#d1fae5', border: '1px solid #059669', color: '#065f46', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem'}}>
                {passwordMessage}
              </div>
            )}
            
            {passwordError && (
              <div style={{backgroundColor: '#fee2e2', border: '1px solid #dc2626', color: '#991b1b', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem'}}>
                {passwordError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                />
              </div>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                />
              </div>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                />
              </div>
              <button type="submit" style={{width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '500'}}>
                Change Password
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
