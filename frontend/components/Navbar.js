'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      fetchCartCount();
    }
  }, []);

  const fetchCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:4000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartCount(res.data.data?.items?.length || 0);
    } catch { }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartCount(0);
    router.push('/');
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: 'Categories', href: '/products' },
    { label: 'Deals', href: '/products?sort=price_asc' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 40px', background: '#fff',
      borderBottom: '1px solid #E0E0E0', position: 'sticky', top: 0, zIndex: 100
    }}>
      {/* Logo */}
      <Link href="/" style={{ fontSize: 22, fontWeight: 800, color: '#00BCD4', textDecoration: 'none' }}>
        Shop<span style={{ color: '#212121' }}>Now</span>
      </Link>

      {/* Nav Links */}
      <ul style={{ display: 'flex', gap: 28, listStyle: 'none', margin: 0, padding: 0 }}>
        {navLinks.map((item) => (
          <li key={item.label}>
            <Link href={item.href} style={{
              textDecoration: 'none',
              color: isActive(item.href) ? '#00BCD4' : '#616161',
              fontSize: 14, fontWeight: 500,
              borderBottom: isActive(item.href) ? '2px solid #00BCD4' : '2px solid transparent',
              paddingBottom: 2, transition: '.2s'
            }}>
              {item.label}
            </Link>
          </li>
        ))}
        {/* Admin link لو role admin */}
        {user?.role === 'admin' && (
          <li>
            <Link href="/admin" style={{
              textDecoration: 'none',
              color: pathname.startsWith('/admin') ? '#00BCD4' : '#616161',
              fontSize: 14, fontWeight: 500,
              borderBottom: pathname.startsWith('/admin') ? '2px solid #00BCD4' : '2px solid transparent',
              paddingBottom: 2
            }}>Admin</Link>
          </li>
        )}
       
        {user?.role === 'seller' && (
          <li>
            <Link href="/seller" style={{
              textDecoration: 'none',
              color: pathname.startsWith('/seller') ? '#00BCD4' : '#616161',
              fontSize: 14, fontWeight: 500,
              borderBottom: pathname.startsWith('/seller') ? '2px solid #00BCD4' : '2px solid transparent',
              paddingBottom: 2
            }}>Dashboard</Link>
          </li>
        )}
      </ul>

  
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user ? (
          <>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#212121' }}>
              👋 {user.name?.split(' ')[0]}
            </span>
            <Link href="/profile" style={{
              width: 36, height: 36, borderRadius: '50%',
              border: `1.5px solid ${pathname === '/profile' ? '#00BCD4' : '#E0E0E0'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', fontSize: 16, overflow: 'hidden',
              background: pathname === '/profile' ? '#E0F7FA' : '#fff'
            }}>
              {user.avatar ? (
                <img src={`http://localhost:4000${user.avatar}`} alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : '👤'}
            </Link>
            <button onClick={handleLogout} style={{
              background: 'none', border: '1.5px solid #E0E0E0',
              borderRadius: 8, padding: '6px 14px', fontSize: 12,
              fontWeight: 500, cursor: 'pointer', color: '#616161',
              fontFamily: 'Poppins, sans-serif', transition: '.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#F44336'; e.currentTarget.style.color = '#F44336'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E0E0E0'; e.currentTarget.style.color = '#616161'; }}
            >Logout</button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/login" style={{
              background: '#00BCD4', color: '#fff', textDecoration: 'none',
              padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600
            }}>Login</Link>
            <Link href="/register" style={{
              background: '#fff', color: '#00BCD4', textDecoration: 'none',
              padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: '1.5px solid #00BCD4'
            }}>Register</Link>
          </div>
        )}

       
        <Link href="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: `1.5px solid ${pathname === '/cart' ? '#00BCD4' : '#E0E0E0'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, background: pathname === '/cart' ? '#E0F7FA' : '#fff'
          }}>🛒</div>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: '#00BCD4', color: '#fff', fontSize: 10,
              width: 18, height: 18, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
            }}>{cartCount}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}