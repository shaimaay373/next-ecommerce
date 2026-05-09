'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputStyle = {
    width: '100%', padding: '13px 14px',
    border: '2px solid #F0F0F0', borderRadius: 12,
    fontSize: 13, fontFamily: 'Poppins, sans-serif',
    outline: 'none', color: '#212121',
    boxSizing: 'border-box', background: '#FAFAFA', transition: '.2s'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:4000/api/auth/register', { ...form, role });
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
      {/* Background circles */}
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
        width: '100%', maxWidth: 460, position: 'relative', zIndex: 1,
        boxShadow: '0 24px 80px rgba(0,188,212,.18), 0 8px 24px rgba(0,0,0,.06)'
      }}>
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)',
            borderRadius: 20, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 32,
            boxShadow: '0 8px 24px rgba(0,188,212,.2)'
          }}>🛒</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#212121', marginBottom: 8 }}>
            Join FreshCart
          </h1>
          <p style={{ fontSize: 13, color: '#9E9E9E', lineHeight: 1.6 }}>
            Create an account to start your fresh journey.
          </p>
        </div>

        {/* Role Toggle */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          background: '#F5F5F5', borderRadius: 12,
          padding: 4, marginBottom: 28
        }}>
          {['customer', 'seller'].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              padding: '10px', border: 'none', cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600,
              borderRadius: 10, transition: '.2s', textTransform: 'capitalize',
              background: role === r ? '#00BCD4' : 'transparent',
              color: role === r ? '#fff' : '#9E9E9E',
              boxShadow: role === r ? '0 4px 12px rgba(0,188,212,.3)' : 'none'
            }}>{r}</button>
          ))}
        </div>

        {error && (
          <div style={{
            background: '#FFEBEE', color: '#C62828', fontSize: 13,
            padding: '12px 16px', borderRadius: 12, marginBottom: 20,
            textAlign: 'center', border: '1px solid #FFCDD2'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>
                Full Name
              </label>
              <input
                type="text" placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#00BCD4'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#F0F0F0'; e.target.style.background = '#FAFAFA'; }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>
                Phone Number
              </label>
              <input
                type="tel" placeholder="+1(555)000-0000"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#00BCD4'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#F0F0F0'; e.target.style.background = '#FAFAFA'; }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', fontSize: 16, opacity: .5
              }}>✉️</span>
              <input
                type="email" placeholder="john@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{ ...inputStyle, paddingLeft: 42 }}
                onFocus={e => { e.target.style.borderColor = '#00BCD4'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#F0F0F0'; e.target.style.background = '#FAFAFA'; }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>
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
                style={{ ...inputStyle, paddingLeft: 42, paddingRight: 44 }}
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

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? '#B2EBF2' : 'linear-gradient(135deg, #00BCD4, #00ACC1)',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(0,188,212,.35)',
            letterSpacing: .3
          }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#9E9E9E', marginTop: 24 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#00BCD4', fontWeight: 700, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}