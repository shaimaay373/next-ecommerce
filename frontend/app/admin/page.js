'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [newPromo, setNewPromo] = useState({ code: '', discountType: 'percentage', discountValue: '', maxUses: '' });
  const [newBanner, setNewBanner] = useState({ image: '', link: '' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    if (!token) { router.push('/login'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, ordersRes, productsRes, categoriesRes, bannersRes] = await Promise.all([
        axios.get('http://localhost:4000/api/admin/users', { headers }),
        axios.get('http://localhost:4000/api/admin/orders', { headers }),
        axios.get('http://localhost:4000/api/products'),
        axios.get('http://localhost:4000/api/categories'),
        axios.get('http://localhost:4000/api/admin/banners', { headers }),
      ]);
      setUsers(usersRes.data.data);
      setOrders(ordersRes.data.data);
      setProducts(productsRes.data.data);
      setCategories(categoriesRes.data.data);
      setBanners(bannersRes.data.data);
    } catch { } finally { setLoading(false); }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await axios.patch(`http://localhost:4000/api/admin/users/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch { }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`http://localhost:4000/api/admin/orders/${orderId}/status`,
        { status }, { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch { }
  };

  const createPromo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/admin/promo', newPromo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewPromo({ code: '', discountType: 'percentage', discountValue: '', maxUses: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const deletePromo = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/promo/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch { }
  };

  const createBanner = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/admin/banners', newBanner, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewBanner({ image: '', link: '' });
      fetchData();
    } catch { }
  };

  const deleteBanner = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch { }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  const statusColors = {
    pending: { bg: '#FFF8E1', color: '#F9A825' },
    confirmed: { bg: '#E3F2FD', color: '#1565C0' },
    shipped: { bg: '#E0F7FA', color: '#00838F' },
    delivered: { bg: '#E8F5E9', color: '#2E7D32' },
    cancelled: { bg: '#FFEBEE', color: '#C62828' },
  };

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'products', icon: '📦', label: 'Products' },
    { id: 'orders', icon: '🛍️', label: 'Orders' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'categories', icon: '🗂️', label: 'Categories' },
    { id: 'banners', icon: '🖼️', label: 'Banners' },
    { id: 'promos', icon: '🎟️', label: 'Promos' },
  ];

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #E0E0E0', borderRadius: 10,
    fontSize: 13, fontFamily: 'Poppins, sans-serif',
    outline: 'none', boxSizing: 'border-box', color: '#212121', background: '#fff'
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80, fontFamily: 'Poppins, sans-serif', color: '#9E9E9E' }}>
      Loading...
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>

      {/* DARK SIDEBAR */}
      <div style={{
        width: 220, flexShrink: 0, background: '#1A1D23',
        display: 'flex', flexDirection: 'column', position: 'fixed',
        top: 0, left: 0, height: '100vh', zIndex: 50
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#00BCD4' }}>ٍ
            ShopNow Admin</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>Management Console</div>
        </div>

        <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              width: '100%', padding: '11px 14px', border: 'none',
              borderRadius: 10, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
              fontSize: 13, fontWeight: 500, textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
              background: activeTab === item.id ? 'rgba(0,188,212,.15)' : 'transparent',
              color: activeTab === item.id ? '#00BCD4' : 'rgba(255,255,255,.6)',
              borderLeft: activeTab === item.id ? '3px solid #00BCD4' : '3px solid transparent',
              transition: '.2s'
            }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00BCD4, #00838F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Administrator</div>
          </div>
        </div>

        <button onClick={() => setActiveTab('settings')} style={{
          margin: '0 12px 16px', padding: '11px 14px', border: 'none',
          borderRadius: 10, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
          fontSize: 13, fontWeight: 500, textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'transparent', color: 'rgba(255,255,255,.4)'
        }}>⚙️ Settings</button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: 220, flex: 1, background: '#F5F5F5', minHeight: '100vh' }}>

        {/* TOP NAV */}
        <div style={{
          background: '#fff', padding: '14px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #F0F0F0', position: 'sticky', top: 0, zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#00BCD4' }}>Fresh</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#212121' }}>Cart</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {['Home', 'Shop', 'Categories', 'Deals'].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: '#616161', textDecoration: 'none', fontWeight: 500 }}>{l}</a>
            ))}
            <div style={{ position: 'relative' }}>
              <input placeholder="Search orders..." style={{
                padding: '8px 14px 8px 36px', border: '1.5px solid #E0E0E0',
                borderRadius: 8, fontSize: 12, fontFamily: 'Poppins, sans-serif',
                outline: 'none', width: 180
              }} />
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#9E9E9E' }}>🔍</span>
            </div>
            <div style={{ fontSize: 20 }}>🛒</div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👤</div>
          </div>
        </div>

        <div style={{ padding: '32px' }}>

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 800, color: '#212121', marginBottom: 4 }}>Dashboard Overview</h1>
                  <p style={{ fontSize: 13, color: '#9E9E9E' }}>Welcome back. Here's what's happening with your store today.</p>
                </div>
                <button style={{
                  padding: '10px 18px', background: '#212121', color: '#fff',
                  border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>⬇ Export Data</button>
              </div>

              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                {[
                  { label: 'TOTAL USERS', value: users.length.toLocaleString(), change: '+12%', icon: '👥', positive: true },
                  { label: 'ACTIVE PRODUCTS', value: products.length.toLocaleString(), change: 'Stable', icon: '📦', positive: true },
                  { label: 'NEW ORDERS', value: orders.length.toLocaleString(), change: '+24%', icon: '🛍️', positive: true },
                  { label: 'TOTAL REVENUE', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`, change: '+8%', icon: '💰', positive: true },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: '#fff', borderRadius: 16, padding: '20px 22px',
                    boxShadow: '0 2px 8px rgba(0,0,0,.05)', border: '1px solid #F0F0F0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{
                        width: 36, height: 36, background: '#E0F7FA',
                        borderRadius: 10, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 18
                      }}>{stat.icon}</div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: stat.positive ? '#2E7D32' : '#C62828',
                        background: stat.positive ? '#E8F5E9' : '#FFEBEE',
                        padding: '2px 8px', borderRadius: 4
                      }}>{stat.change}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', letterSpacing: .5, marginBottom: 6 }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#212121' }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
                <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5F5F5' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} style={{
                    background: 'none', border: 'none', color: '#00BCD4',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                  }}>View all orders →</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FAFAFA' }}>
                      {['ORDER ID', 'CUSTOMER', 'TOTAL', 'STATUS', 'ACTIONS'].map(h => (
                        <th key={h} style={{ padding: '12px 20px', fontSize: 10, fontWeight: 700, color: '#9E9E9E', textAlign: 'left', letterSpacing: .5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => {
                      const s = statusColors[order.status] || statusColors.pending;
                      return (
                        <tr key={order._id} style={{ borderTop: '1px solid #F5F5F5' }}>
                          <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#212121' }}>
                            #FC {order._id.slice(-4)}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 30, height: 30, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: 11, fontWeight: 700
                              }}>
                                {order.user?.name?.charAt(0).toUpperCase() || 'G'}
                              </div>
                              <span style={{ fontSize: 13, color: '#212121' }}>
                                {order.user?.name || 'Guest'}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#212121' }}>
                            ${order.totalPrice?.toFixed(2)}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{
                              background: s.bg, color: s.color,
                              fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6
                            }}>{order.status}</span>
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <select
                              value={order.status}
                              onChange={e => updateOrderStatus(order._id, e.target.value)}
                              style={{
                                padding: '6px 10px', border: '1.5px solid #E0E0E0',
                                borderRadius: 6, fontSize: 11, cursor: 'pointer',
                                fontFamily: 'Poppins, sans-serif', outline: 'none'
                              }}>
                              {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 24 }}>User Management</h2>
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FAFAFA' }}>
                      {['USER', 'EMAIL', 'PHONE', 'ROLE', 'STATUS', 'ACTIONS'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: '#9E9E9E', textAlign: 'left', letterSpacing: .5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={{ borderTop: '1px solid #F5F5F5' }}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: '50%',
                              background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: 13, fontWeight: 700, overflow: 'hidden'
                            }}>
                              {u.avatar ? <img src={`http://localhost:4000${u.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: 12, color: '#616161' }}>{u.email}</td>
                        <td style={{ padding: '14px 20px', fontSize: 12, color: '#616161' }}>{u.phone}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                            background: u.role === 'admin' ? '#EDE7F6' : u.role === 'seller' ? '#E0F7FA' : '#F5F5F5',
                            color: u.role === 'admin' ? '#4527A0' : u.role === 'seller' ? '#00838F' : '#616161',
                            textTransform: 'capitalize'
                          }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                            background: u.isActive ? '#E8F5E9' : '#FFEBEE',
                            color: u.isActive ? '#2E7D32' : '#C62828'
                          }}>{u.isActive ? 'Active' : 'Restricted'}</span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <button onClick={() => toggleUserStatus(u._id)} style={{
                            padding: '6px 14px', border: `1.5px solid ${u.isActive ? '#FFCDD2' : '#C8E6C9'}`,
                            borderRadius: 6, background: '#fff', fontSize: 11,
                            fontWeight: 600, cursor: 'pointer',
                            color: u.isActive ? '#F44336' : '#4CAF50',
                            fontFamily: 'Poppins, sans-serif'
                          }}>{u.isActive ? 'Restrict' : 'Activate'}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 24 }}>Product Management</h2>
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FAFAFA' }}>
                      {['PRODUCT', 'CATEGORY', 'PRICE', 'STOCK', 'RATING', 'STATUS'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: '#9E9E9E', textAlign: 'left', letterSpacing: .5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id} style={{ borderTop: '1px solid #F5F5F5' }}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', background: '#F5F5F5', flexShrink: 0 }}>
                              {p.images?.[0] ? <img src={`http://localhost:4000${p.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>{p.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: 12, color: '#616161' }}>{p.category?.name}</td>
                        <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#00838F' }}>${p.price}</td>
                        <td style={{ padding: '14px 20px', fontSize: 12, color: '#212121' }}>{p.stock}</td>
                        <td style={{ padding: '14px 20px', fontSize: 12, color: '#FFC107' }}>
                          {'★'.repeat(Math.round(p.averageRating || 0))} <span style={{ color: '#9E9E9E' }}>({p.ratings?.length || 0})</span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                            background: p.isActive ? '#E8F5E9' : '#FFEBEE',
                            color: p.isActive ? '#2E7D32' : '#C62828'
                          }}>{p.isActive ? 'Active' : 'Inactive'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 24 }}>Order Management</h2>
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FAFAFA' }}>
                      {['ORDER ID', 'CUSTOMER', 'ITEMS', 'TOTAL', 'PAYMENT', 'STATUS', 'UPDATE'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: '#9E9E9E', textAlign: 'left', letterSpacing: .5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => {
                      const s = statusColors[order.status] || statusColors.pending;
                      return (
                        <tr key={order._id} style={{ borderTop: '1px solid #F5F5F5' }}>
                          <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#212121' }}>
                            #FC {order._id.slice(-4)}
                          </td>
                          <td style={{ padding: '14px 20px', fontSize: 12, color: '#616161' }}>
                            {order.user?.name || 'Guest'}
                          </td>
                          <td style={{ padding: '14px 20px', fontSize: 12, color: '#616161' }}>
                            {order.items?.length}
                          </td>
                          <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#00838F' }}>
                            ${order.totalPrice?.toFixed(2)}
                          </td>
                          <td style={{ padding: '14px 20px', fontSize: 11, color: '#616161', textTransform: 'capitalize' }}>
                            {order.paymentMethod}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{
                              background: s.bg, color: s.color, fontSize: 10,
                              fontWeight: 700, padding: '3px 10px', borderRadius: 6, textTransform: 'capitalize'
                            }}>{order.status}</span>
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <select
                              value={order.status}
                              onChange={e => updateOrderStatus(order._id, e.target.value)}
                              style={{
                                padding: '6px 10px', border: '1.5px solid #E0E0E0',
                                borderRadius: 6, fontSize: 11, cursor: 'pointer',
                                fontFamily: 'Poppins, sans-serif', outline: 'none'
                              }}>
                              {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 24 }}>Categories</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {categories.map(cat => (
                  <div key={cat._id} style={{
                    background: '#fff', borderRadius: 14, overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,.05)', border: '1.5px solid #F0F0F0'
                  }}>
                    <div style={{ height: 100, overflow: 'hidden', background: '#E0F7FA' }}>
                      {cat.image ? <img src={`http://localhost:4000${cat.image}`} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🗂️</div>}
                    </div>
                    <div style={{ padding: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#212121', marginBottom: 4 }}>{cat.name}</div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                        background: cat.isActive ? '#E8F5E9' : '#FFEBEE',
                        color: cat.isActive ? '#2E7D32' : '#C62828'
                      }}>{cat.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BANNERS TAB */}
          {activeTab === 'banners' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 24 }}>Banners</h2>
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,.05)', marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Add Banner</h3>
                <form onSubmit={createBanner} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 6 }}>Image URL</label>
                    <input type="text" placeholder="https://..." value={newBanner.image}
                      onChange={e => setNewBanner({ ...newBanner, image: e.target.value })}
                      required style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#00BCD4'}
                      onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 6 }}>Link</label>
                    <input type="text" placeholder="/products" value={newBanner.link}
                      onChange={e => setNewBanner({ ...newBanner, link: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#00BCD4'}
                      onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                  </div>
                  <button type="submit" style={{
                    padding: '10px 20px', background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                    color: '#fff', border: 'none', borderRadius: 10, fontSize: 13,
                    fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                    whiteSpace: 'nowrap'
                  }}>Add Banner</button>
                </form>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {banners.map(b => (
                  <div key={b._id} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
                    <div style={{ height: 120, background: '#E0F7FA', overflow: 'hidden' }}>
                      {b.image && <img src={b.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#616161' }}>{b.link || 'No link'}</span>
                      <button onClick={() => deleteBanner(b._id)} style={{
                        padding: '5px 12px', border: '1.5px solid #FFCDD2',
                        borderRadius: 6, background: '#fff', fontSize: 11,
                        fontWeight: 600, cursor: 'pointer', color: '#F44336',
                        fontFamily: 'Poppins, sans-serif'
                      }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROMOS TAB */}
          {activeTab === 'promos' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 24 }}>Promo Codes</h2>
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,.05)', marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Create Promo Code</h3>
                <form onSubmit={createPromo}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 6 }}>Code</label>
                      <input type="text" placeholder="SAVE20" value={newPromo.code}
                        onChange={e => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                        required style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#00BCD4'}
                        onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 6 }}>Type</label>
                      <select value={newPromo.discountType}
                        onChange={e => setNewPromo({ ...newPromo, discountType: e.target.value })}
                        style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 6 }}>Value</label>
                      <input type="number" placeholder="20" value={newPromo.discountValue}
                        onChange={e => setNewPromo({ ...newPromo, discountValue: e.target.value })}
                        required style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#00BCD4'}
                        onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 6 }}>Max Uses</label>
                      <input type="number" placeholder="100" value={newPromo.maxUses}
                        onChange={e => setNewPromo({ ...newPromo, maxUses: e.target.value })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#00BCD4'}
                        onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                    </div>
                  </div>
                  <button type="submit" style={{
                    padding: '10px 24px', background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                    color: '#fff', border: 'none', borderRadius: 10, fontSize: 13,
                    fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                  }}>Create Promo</button>
                </form>
              </div>

              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FAFAFA' }}>
                      {['CODE', 'TYPE', 'VALUE', 'USED', 'MAX USES', 'STATUS', 'ACTIONS'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 700, color: '#9E9E9E', textAlign: 'left', letterSpacing: .5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {promos.map(promo => (
                      <tr key={promo._id} style={{ borderTop: '1px solid #F5F5F5' }}>
                        <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#212121', letterSpacing: 1 }}>{promo.code}</td>
                        <td style={{ padding: '14px 20px', fontSize: 12, color: '#616161', textTransform: 'capitalize' }}>{promo.discountType}</td>
                        <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#00838F' }}>
                          {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: 12, color: '#616161' }}>{promo.usedCount}</td>
                        <td style={{ padding: '14px 20px', fontSize: 12, color: '#616161' }}>{promo.maxUses || '∞'}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                            background: promo.isActive ? '#E8F5E9' : '#FFEBEE',
                            color: promo.isActive ? '#2E7D32' : '#C62828'
                          }}>{promo.isActive ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <button onClick={() => deletePromo(promo._id)} style={{
                            padding: '5px 12px', border: '1.5px solid #FFCDD2',
                            borderRadius: 6, background: '#fff', fontSize: 11,
                            fontWeight: 600, cursor: 'pointer', color: '#F44336',
                            fontFamily: 'Poppins, sans-serif'
                          }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {promos.length === 0 && (
                  <div style={{ padding: 40, textAlign: 'center', color: '#9E9E9E', fontSize: 14 }}>
                    No promo codes yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}