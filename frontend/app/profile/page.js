'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({ name: '', phone: '', address: { street: '', city: '', country: '' } });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, ordersRes, wishlistRes] = await Promise.all([
        axios.get('http://localhost:4000/api/users/profile', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:4000/api/orders/my', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:4000/api/wishlist', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUser(profileRes.data.data);
      setOrders(ordersRes.data.data);
      setWishlist(wishlistRes.data.data);
      setEditForm({
        name: profileRes.data.data.name || '',
        phone: profileRes.data.data.phone || '',
        address: profileRes.data.data.address || { street: '', city: '', country: '' }
      });
    } catch { } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await axios.put('http://localhost:4000/api/users/profile/avatar', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
    } catch { alert('Failed to update avatar'); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put('http://localhost:4000/api/users/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      setSaveMsg('Profile updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch { setSaveMsg('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(wishlist.filter(p => p._id !== productId));
    } catch { }
  };

  const totalSpent = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length;

  const statusColors = {
    pending: { bg: '#FFF8E1', color: '#F9A825', label: 'Pending' },
    confirmed: { bg: '#E3F2FD', color: '#1565C0', label: 'Confirmed' },
    shipped: { bg: '#E0F7FA', color: '#00838F', label: 'Shipped' },
    delivered: { bg: '#E8F5E9', color: '#2E7D32', label: 'Delivered' },
    cancelled: { bg: '#FFEBEE', color: '#C62828', label: 'Cancelled' },
  };

  const navItems = [
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'wishlist', icon: '🤍', label: 'Wishlist' },
    { id: 'edit', icon: '✏️', label: 'Edit Profile' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
  ];

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E0E0E0', borderRadius: 10,
    fontSize: 13, fontFamily: 'Poppins, sans-serif',
    outline: 'none', boxSizing: 'border-box', color: '#212121'
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 80, fontFamily: 'Poppins, sans-serif', color: '#9E9E9E' }}>
        Loading...
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div style={{ background: '#F5F5F5', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* SIDEBAR */}
          <div style={{ width: 220, flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,.06)', textAlign: 'center' }}>

              {/* Avatar with upload */}
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 12px' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, fontWeight: 700, color: '#fff',
                  border: '3px solid #E0F7FA', overflow: 'hidden'
                }}>
                  {user?.avatar ? (
                    <img
                      src={`http://localhost:4000${user.avatar}`}
                      alt="avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Edit Button */}
                <label style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 24, height: 24, background: '#00BCD4',
                  borderRadius: '50%', border: '2px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 11
                }}>
                  ✏️
                  <input
                    type="file" accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>

                {/* Online indicator */}
                <div style={{
                  position: 'absolute', bottom: 2, left: 2,
                  width: 14, height: 14, background: '#4CAF50',
                  borderRadius: '50%', border: '2px solid #fff'
                }} />
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#212121', marginBottom: 4 }}>
                {user?.name}
              </h3>
              <p style={{ fontSize: 12, color: '#9E9E9E', marginBottom: 12 }}>{user?.email}</p>

              <span style={{
                display: 'inline-block', background: '#E0F7FA', color: '#00838F',
                fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20
              }}>
                {user?.role === 'admin' ? '⭐ Admin' : user?.role === 'seller' ? '🏪 Seller' : '💎 Premium Member'}
              </span>

              {/* Nav */}
              <div style={{ marginTop: 24, textAlign: 'left' }}>
                {navItems.map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                    width: '100%', padding: '11px 14px', border: 'none',
                    borderRadius: 10, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                    fontSize: 13, fontWeight: 500, textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
                    background: activeTab === item.id ? '#E0F7FA' : 'transparent',
                    color: activeTab === item.id ? '#00838F' : '#616161',
                    transition: '.2s'
                  }}>
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}

                <div style={{ borderTop: '1px solid #F0F0F0', marginTop: 8, paddingTop: 8 }}>
                  <button onClick={handleLogout} style={{
                    width: '100%', padding: '11px 14px', border: 'none',
                    borderRadius: 10, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                    fontSize: 13, fontWeight: 500, textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'transparent', color: '#F44336', transition: '.2s'
                  }}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div style={{ flex: 1 }}>

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 4 }}>Recent Orders</h2>
                    <p style={{ fontSize: 13, color: '#9E9E9E' }}>Manage and track your latest purchases</p>
                  </div>
                  <button style={{
                    padding: '8px 16px', border: '1.5px solid #E0E0E0',
                    borderRadius: 8, background: '#fff', fontSize: 12,
                    fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                    color: '#616161', display: 'flex', alignItems: 'center', gap: 6
                  }}>⚙️ Filter</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                  {[
                    { label: 'TOTAL SPENT', value: `$${totalSpent.toFixed(2)}`, color: '#00838F' },
                    { label: 'ACTIVE ORDERS', value: activeOrders, color: '#212121' },
                    { label: 'SAVED ITEMS', value: wishlist.length, color: '#212121' },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: '#fff', borderRadius: 14, padding: '18px 20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,.04)'
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9E9E9E', letterSpacing: .5, marginBottom: 8 }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 ? (
                  <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                    <p style={{ color: '#9E9E9E', fontSize: 14 }}>No orders yet</p>
                    <Link href="/products" style={{ color: '#00BCD4', fontWeight: 600, fontSize: 13 }}>Start Shopping →</Link>
                  </div>
                ) : (
                  orders.map(order => {
                    const s = statusColors[order.status] || statusColors.pending;
                    return (
                      <div key={order._id} style={{
                        background: '#fff', borderRadius: 16, padding: 20,
                        boxShadow: '0 2px 8px rgba(0,0,0,.04)', marginBottom: 12
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, background: '#F5F5F5',
                              borderRadius: 10, display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontSize: 18
                            }}>🛍️</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>
                                Order #{order._id.slice(-6).toUpperCase()}
                              </div>
                              <div style={{ fontSize: 11, color: '#9E9E9E' }}>
                                Placed {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{
                              background: s.bg, color: s.color,
                              fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6
                            }}>● {s.label}</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>
                              ${order.totalPrice?.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                          {order.items?.slice(0, 3).map((item, i) => (
                            <div key={i} style={{
                              width: 44, height: 44, borderRadius: 8, overflow: 'hidden',
                              background: '#F5F5F5', border: '1.5px solid #E0E0E0'
                            }}>
                              {item.product?.images?.[0] ? (
                                <img src={`http://localhost:4000${item.product.images[0]}`}
                                  alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📦</div>
                              )}
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div style={{
                              width: 44, height: 44, borderRadius: 8,
                              background: '#F5F5F5', border: '1.5px solid #E0E0E0',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, fontWeight: 700, color: '#9E9E9E'
                            }}>+{order.items.length - 3}</div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          {order.status === 'shipped' && (
                            <button style={{
                              padding: '8px 16px', border: '1.5px solid #E0E0E0',
                              borderRadius: 8, background: '#fff', fontSize: 12,
                              fontWeight: 600, cursor: 'pointer', color: '#616161',
                              fontFamily: 'Poppins, sans-serif'
                            }}>Track Order</button>
                          )}
                          {order.status === 'delivered' && (
                            <button style={{
                              padding: '8px 16px', border: '1.5px solid #E0E0E0',
                              borderRadius: 8, background: '#fff', fontSize: 12,
                              fontWeight: 600, cursor: 'pointer', color: '#616161',
                              fontFamily: 'Poppins, sans-serif'
                            }}>Buy Again</button>
                          )}
                          {order.status === 'pending' && (
                            <button style={{
                              padding: '8px 16px', border: '1.5px solid #FFCDD2',
                              borderRadius: 8, background: '#fff', fontSize: 12,
                              fontWeight: 600, cursor: 'pointer', color: '#F44336',
                              fontFamily: 'Poppins, sans-serif'
                            }}>Cancel Order</button>
                          )}
                          <Link href={`/orders/${order._id}`} style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                            borderRadius: 8, fontSize: 12, fontWeight: 700,
                            color: '#fff', textDecoration: 'none'
                          }}>Order Details</Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 20 }}>My Wishlist</h2>
                {wishlist.length === 0 ? (
                  <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🤍</div>
                    <p style={{ color: '#9E9E9E', fontSize: 14 }}>Your wishlist is empty</p>
                    <Link href="/products" style={{ color: '#00BCD4', fontWeight: 600, fontSize: 13 }}>Browse Products →</Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {wishlist.map(product => (
                      <div key={product._id} style={{
                        background: '#fff', borderRadius: 14, overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,.04)', border: '1.5px solid #F0F0F0'
                      }}>
                        <div style={{ height: 140, background: '#F5F5F5', overflow: 'hidden' }}>
                          {product.images?.[0] ? (
                            <img src={`http://localhost:4000${product.images[0]}`}
                              alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📦</div>
                          )}
                        </div>
                        <div style={{ padding: 14 }}>
                          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#212121' }}>{product.name}</h3>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#00838F' }}>${product.price}</span>
                            <button onClick={() => removeFromWishlist(product._id)} style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: 16, color: '#F44336'
                            }}>🗑</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* EDIT PROFILE TAB */}
            {activeTab === 'edit' && (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 20 }}>Edit Profile</h2>
                <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                  <form onSubmit={handleSaveProfile}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>Full Name</label>
                        <input type="text" value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = '#00BCD4'}
                          onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>Phone</label>
                        <input type="tel" value={editForm.phone}
                          onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = '#00BCD4'}
                          onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>Street Address</label>
                      <input type="text" value={editForm.address?.street || ''}
                        onChange={e => setEditForm({ ...editForm, address: { ...editForm.address, street: e.target.value } })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#00BCD4'}
                        onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>City</label>
                        <input type="text" value={editForm.address?.city || ''}
                          onChange={e => setEditForm({ ...editForm, address: { ...editForm.address, city: e.target.value } })}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = '#00BCD4'}
                          onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>Country</label>
                        <input type="text" value={editForm.address?.country || ''}
                          onChange={e => setEditForm({ ...editForm, address: { ...editForm.address, country: e.target.value } })}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = '#00BCD4'}
                          onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                      </div>
                    </div>

                    {saveMsg && (
                      <div style={{
                        padding: '10px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13,
                        background: saveMsg.includes('success') ? '#E8F5E9' : '#FFEBEE',
                        color: saveMsg.includes('success') ? '#2E7D32' : '#C62828'
                      }}>{saveMsg}</div>
                    )}

                    <button type="submit" disabled={saving} style={{
                      padding: '13px 28px',
                      background: 'linear-gradient(135deg, #00BCD4, #00ACC1)',
                      color: '#fff', border: 'none', borderRadius: 10,
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      boxShadow: '0 4px 14px rgba(0,188,212,.3)'
                    }}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 20 }}>Notifications</h2>
                <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
                  <p style={{ color: '#9E9E9E', fontSize: 14 }}>No notifications yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}