'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // لما الـ Google login ينجح يحفظ الـ token
  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem('token', session.accessToken);
      localStorage.setItem('user', JSON.stringify({
        name: session.user.name,
        email: session.user.email,
        role: session.user.role || 'customer',
        id: session.user.id
      }));
      router.push('/');
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', form);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Wrong email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #E0F7FA 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Poppins, sans-serif', padding: 20,
      position: 'relative', overflow: 'hidden'
    }}>
      {[
        { w: 300, h: 300, top: -80, left: -80, op: 0.15 },
        { w: 200, h: 200, bottom: -40, right: -40, op: 0.12 },
        { w: 150, h: 150, top: '40%', right: 60, op: 0.1 },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute', width: c.w, height: c.h,
          borderRadius: '50%', background: '#00BCD4', opacity: c.op,
          top: c.top, left: c.left, bottom: c.bottom, right: c.right
        }} />
      ))}

      <div style={{
        background: '#fff', borderRadius: 24, padding: '48px 44px',
        width: '100%', maxWidth: 420, position: 'relative', zIndex: 1,
        boxShadow: '0 24px 80px rgba(0,188,212,.18), 0 8px 24px rgba(0,0,0,.06)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)',
            borderRadius: 20, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 32,
            boxShadow: '0 8px 24px rgba(0,188,212,.2)'
          }}>🛒</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#212121', marginBottom: 8 }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 13, color: '#9E9E9E', lineHeight: 1.6 }}>
            Login to access your FreshCart<br />dashboard and shop your favorites.
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FFEBEE', color: '#C62828', fontSize: 13,
            padding: '12px 16px', borderRadius: 12, marginBottom: 20,
            textAlign: 'center', border: '1px solid #FFCDD2'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 8 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', fontSize: 16, opacity: .5
              }}>✉️</span>
              <input
                type="email" placeholder="name@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  width: '100%', padding: '13px 14px 13px 42px',
                  border: '2px solid #F0F0F0', borderRadius: 12,
                  fontSize: 13, fontFamily: 'Poppins, sans-serif',
                  outline: 'none', color: '#212121', boxSizing: 'border-box',
                  background: '#FAFAFA', transition: '.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#00BCD4'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#F0F0F0'; e.target.style.background = '#FAFAFA'; }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', fontSize: 16, opacity: .5
              }}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{
                  width: '100%', padding: '13px 44px 13px 42px',
                  border: '2px solid #F0F0F0', borderRadius: 12,
                  fontSize: 13, fontFamily: 'Poppins, sans-serif',
                  outline: 'none', color: '#212121', boxSizing: 'border-box',
                  background: '#FAFAFA', transition: '.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#00BCD4'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#F0F0F0'; e.target.style.background = '#FAFAFA'; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', fontSize: 16, opacity: .5
              }}>{showPassword ? '🙈' : '👁️'}</button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#616161', cursor: 'pointer' }}>
              <input
                type="checkbox" checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ accentColor: '#00BCD4', width: 14, height: 14 }}
              />
              Remember me
            </label>
            <Link href="/forgot-password" style={{ fontSize: 12, color: '#00BCD4', textDecoration: 'none', fontWeight: 600 }}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? '#B2EBF2' : 'linear-gradient(135deg, #00BCD4, #00ACC1)',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Poppins, sans-serif', transition: '.2s',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(0,188,212,.35)',
            letterSpacing: .3
          }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#F0F0F0' }} />
          <span style={{ fontSize: 12, color: '#BDBDBD', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: '#F0F0F0' }} />
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          style={{
            width: '100%', padding: '13px',
            background: '#fff', border: '2px solid #F0F0F0',
            borderRadius: 12, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, color: '#424242', transition: '.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#00BCD4'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#F0F0F0'}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Sign in with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#9E9E9E', marginTop: 24 }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#00BCD4', fontWeight: 700, textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}