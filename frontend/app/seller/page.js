'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SellerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '' });
  const [productImages, setProductImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    if (!token) { router.push('/login'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:4000/api/seller/products', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:4000/api/seller/orders', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:4000/api/categories'),
      ]);
      setProducts(productsRes.data.data);
      setOrders(ordersRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch { } finally { setLoading(false); }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
    setPreviewImages(files.map(f => URL.createObjectURL(f)));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      formData.append('category', newProduct.category);
      productImages.forEach(img => formData.append('images', img));
      await axios.post('http://localhost:4000/api/products', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setNewProduct({ name: '', description: '', price: '', stock: '', category: '' });
      setProductImages([]);
      setPreviewImages([]);
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    } finally { setSubmitting(false); }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category?._id
    });
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:4000/api/products/${editingProduct}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProduct(null);
      fetchData();
    } catch { alert('Failed to update product'); }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`http://localhost:4000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch { alert('Failed to delete product'); }
  };

  const totalSales = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length;

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
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #E0E0E0', borderRadius: 10,
    fontSize: 13, fontFamily: 'Poppins, sans-serif',
    outline: 'none', boxSizing: 'border-box', color: '#212121', background: '#fff'
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 80, fontFamily: 'Poppins, sans-serif', color: '#9E9E9E' }}>
        Loading...
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div style={{ background: '#F5F5F5', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', display: 'flex' }}>

        {/* SIDEBAR */}
        <div style={{ width: 220, flexShrink: 0, background: '#fff', minHeight: '100vh', boxShadow: '2px 0 12px rgba(0,0,0,.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 20px', borderBottom: '1px solid #F0F0F0' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>FreshCart Seller</div>
            <div style={{ fontSize: 11, color: '#9E9E9E', marginTop: 2 }}>Store Dashboard</div>
          </div>
          <div style={{ flex: 1, padding: '16px 12px' }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                width: '100%', padding: '11px 14px', border: 'none',
                borderRadius: 10, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                fontSize: 13, fontWeight: 500, textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
                background: activeTab === item.id ? '#E0F7FA' : 'transparent',
                color: activeTab === item.id ? '#00838F' : '#616161', transition: '.2s'
              }}>
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
          <div style={{ padding: '16px 20px', borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #00BCD4, #00838F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#212121' }}>{user?.name}</div>
              <div style={{ fontSize: 10, color: '#9E9E9E' }}>Store Manager</div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{
                background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                borderRadius: 16, padding: '24px 28px', marginBottom: 24,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                    Welcome back, {user?.name?.split(' ')[0]}!
                  </h2>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.85)' }}>
                    Your store performance is up 12% this week. Keep it up!
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 12, padding: '14px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)', fontWeight: 700, letterSpacing: .5, marginBottom: 4 }}>TOTAL SALES</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>${totalSales.toFixed(0)}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 12, padding: '14px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)', fontWeight: 700, letterSpacing: .5, marginBottom: 4 }}>ACTIVE ORDERS</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{activeOrders}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>My Products</h3>
                <button onClick={() => { setActiveTab('products'); setShowAddForm(true); }} style={{
                  padding: '10px 18px', background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                  color: '#fff', border: 'none', borderRadius: 10, fontSize: 13,
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                }}>+ New Product</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {products.slice(0, 4).map(product => (
                  <div key={product._id} style={{
                    background: '#fff', borderRadius: 14, overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,.06)', border: '1.5px solid #F0F0F0'
                  }}>
                    <div style={{ height: 130, background: '#F5F5F5', overflow: 'hidden' }}>
                      {product.images?.[0] ? (
                        <img src={`http://localhost:4000${product.images[0]}`}
                          alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📦</div>
                      )}
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#212121', marginBottom: 6 }}>{product.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#00838F' }}>${product.price}</span>
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                          background: product.stock > 10 ? '#E8F5E9' : product.stock > 0 ? '#FFF8E1' : '#FFEBEE',
                          color: product.stock > 10 ? '#2E7D32' : product.stock > 0 ? '#F9A825' : '#C62828'
                        }}>
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} Left` : 'Out'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, background: '#E0F7FA', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>➕</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>Add New Product</div>
                    <div style={{ fontSize: 12, color: '#9E9E9E' }}>Fill in the details to list a new item in your shop.</div>
                  </div>
                </div>
                <button onClick={() => { setActiveTab('products'); setShowAddForm(true); }} style={{
                  marginTop: 12, padding: '10px 20px', background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                  color: '#fff', border: 'none', borderRadius: 8, fontSize: 12,
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                }}>Go to Add Product →</button>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121' }}>My Products</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{
                  padding: '10px 18px', background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                  color: '#fff', border: 'none', borderRadius: 10, fontSize: 13,
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                }}>+ New Product</button>
              </div>

              {showAddForm && (
                <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,.06)', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 32, background: '#E0F7FA', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>➕</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>Add New Product</div>
                      <div style={{ fontSize: 12, color: '#9E9E9E' }}>Fill in the details to list a new item in your shop.</div>
                    </div>
                  </div>
                  <form onSubmit={handleAddProduct}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                      <div>
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>Product Name</label>
                          <input type="text" placeholder="e.g. Organic Green Tea"
                            value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                            required style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#00BCD4'}
                            onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>Category</label>
                          <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                            required style={{ ...inputStyle, cursor: 'pointer' }}
                            onFocus={e => e.target.style.borderColor = '#00BCD4'}
                            onBlur={e => e.target.style.borderColor = '#E0E0E0'}>
                            <option value="">Select a category</option>
                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                          </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                          <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>Price ($)</label>
                            <input type="number" placeholder="0.00" step="0.01" min="0"
                              value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                              required style={inputStyle}
                              onFocus={e => e.target.style.borderColor = '#00BCD4'}
                              onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                          </div>
                          <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>Stock</label>
                            <input type="number" placeholder="0" min="0"
                              value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                              required style={inputStyle}
                              onFocus={e => e.target.style.borderColor = '#00BCD4'}
                              onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                          </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>Description</label>
                          <textarea placeholder="Tell customers about your product..."
                            value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                            required rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                            onFocus={e => e.target.style.borderColor = '#00BCD4'}
                            onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>Product Images</label>
                        <label style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          justifyContent: 'center', height: 200, border: '2px dashed #E0E0E0',
                          borderRadius: 12, cursor: 'pointer', background: '#FAFAFA', transition: '.2s', marginBottom: 12
                        }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#00BCD4'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E0E0'}>
                          <span style={{ fontSize: 32, marginBottom: 8 }}>☁️</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#424242' }}>Click to upload or drag and drop</span>
                          <span style={{ fontSize: 11, color: '#9E9E9E', marginTop: 4 }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
                          <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </label>
                        {previewImages.length > 0 && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {previewImages.map((src, i) => (
                              <div key={i} style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', border: '1.5px solid #E0E0E0' }}>
                                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                      <button type="button" onClick={() => setShowAddForm(false)} style={{
                        padding: '11px 24px', border: '1.5px solid #E0E0E0', borderRadius: 10,
                        background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        color: '#616161', fontFamily: 'Poppins, sans-serif'
                      }}>Discard</button>
                      <button type="submit" disabled={submitting} style={{
                        padding: '11px 24px', background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                        color: '#fff', border: 'none', borderRadius: 10, fontSize: 13,
                        fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                        boxShadow: '0 4px 14px rgba(0,188,212,.3)'
                      }}>{submitting ? 'Publishing...' : 'Publish Product'}</button>
                    </div>
                  </form>
                </div>
              )}

              {products.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                  <p style={{ color: '#9E9E9E', fontSize: 14 }}>No products yet. Add your first product!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {products.map(product => (
                    <div key={product._id} style={{
                      background: '#fff', borderRadius: 14, overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,.06)', border: '1.5px solid #F0F0F0'
                    }}>
                      <div style={{ height: 160, background: '#F5F5F5', overflow: 'hidden', position: 'relative' }}>
                        {product.images?.[0] ? (
                          <img src={`http://localhost:4000${product.images[0]}`}
                            alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>📦</div>
                        )}
                        <span style={{
                          position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700,
                          padding: '3px 8px', borderRadius: 4,
                          background: product.stock > 10 ? '#E8F5E9' : product.stock > 0 ? '#FFF8E1' : '#FFEBEE',
                          color: product.stock > 10 ? '#2E7D32' : product.stock > 0 ? '#F9A825' : '#C62828'
                        }}>
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} Left` : 'Out of Stock'}
                        </span>
                      </div>
                      <div style={{ padding: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#212121', marginBottom: 4 }}>{product.name}</div>
                        <div style={{ fontSize: 11, color: '#9E9E9E', marginBottom: 10 }}>{product.category?.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#00838F' }}>${product.price}</span>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => handleEditProduct(product)} style={{
                              padding: '5px 12px', border: '1.5px solid #B2EBF2',
                              borderRadius: 6, background: '#fff', fontSize: 11,
                              fontWeight: 600, cursor: 'pointer', color: '#00838F',
                              fontFamily: 'Poppins, sans-serif'
                            }}>Edit</button>
                            <button onClick={() => handleDeleteProduct(product._id)} style={{
                              padding: '5px 12px', border: '1.5px solid #FFCDD2',
                              borderRadius: 6, background: '#fff', fontSize: 11,
                              fontWeight: 600, cursor: 'pointer', color: '#F44336',
                              fontFamily: 'Poppins, sans-serif'
                            }}>Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 24 }}>My Orders</h2>
              {orders.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
                  <p style={{ color: '#9E9E9E', fontSize: 14 }}>No orders yet</p>
                </div>
              ) : (
                <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F9F9F9' }}>
                        {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status'].map(h => (
                          <th key={h} style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, color: '#9E9E9E', textAlign: 'left', letterSpacing: .5, textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => {
                        const s = statusColors[order.status] || statusColors.pending;
                        return (
                          <tr key={order._id} style={{ borderTop: '1px solid #F5F5F5' }}>
                            <td style={{ padding: '14px 16px', fontSize: 12, fontWeight: 600, color: '#212121' }}>#{order._id.slice(-6).toUpperCase()}</td>
                            <td style={{ padding: '14px 16px', fontSize: 12, color: '#616161' }}>{order.user?.name || 'Guest'}</td>
                            <td style={{ padding: '14px 16px', fontSize: 12, color: '#616161' }}>{order.items?.length} items</td>
                            <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#00838F' }}>${order.totalPrice?.toFixed(2)}</td>
                            <td style={{ padding: '14px 16px', fontSize: 11, color: '#616161', textTransform: 'capitalize' }}>{order.paymentMethod}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6, textTransform: 'capitalize' }}>{order.status}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 24 }}>Users</h2>
              <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
                <p style={{ color: '#9E9E9E', fontSize: 14 }}>User management is available in the Admin panel</p>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 24 }}>Settings</h2>
              <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>⚙️</div>
                <p style={{ color: '#9E9E9E', fontSize: 14 }}>Settings coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: 480, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#212121' }}>Edit Product</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 6 }}>Name</label>
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#00BCD4'}
                onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 6 }}>Price ($)</label>
                <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00BCD4'}
                  onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 6 }}>Stock</label>
                <input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00BCD4'}
                  onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 6 }}>Description</label>
              <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#00BCD4'}
                onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingProduct(null)} style={{
                padding: '10px 20px', border: '1.5px solid #E0E0E0', borderRadius: 10,
                background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                color: '#616161', fontFamily: 'Poppins, sans-serif'
              }}>Cancel</button>
              <button onClick={handleUpdateProduct} style={{
                padding: '10px 20px', background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                color: '#fff', border: 'none', borderRadius: 10, fontSize: 13,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}