'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data);
    } catch { } finally { setLoading(false); }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(`http://localhost:4000/api/cart/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch { }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch { }
  };

  const applyPromo = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/orders/apply-promo',
        { promoCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiscount(res.data.discount);
      setPromoMsg('Promo applied successfully!');
    } catch (err) {
      setPromoMsg(err.response?.data?.message || 'Invalid promo code');
      setDiscount(0);
    }
  };

  const subtotal = cart?.items?.reduce((acc, item) =>
    acc + (item.product?.price || 0) * item.quantity, 0) || 0;
  const shipping = subtotal > 150 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  if (loading) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 80, fontFamily: 'Poppins, sans-serif', color: '#9E9E9E' }}>
        Loading cart...
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div style={{ background: '#F5F5F5', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#212121', marginBottom: 6 }}>Shopping Cart</h1>
          <p style={{ fontSize: 13, color: '#9E9E9E', marginBottom: 32 }}>
            You have {cart?.items?.length || 0} item{cart?.items?.length !== 1 ? 's' : ''} in your cart.
          </p>

          {!cart?.items?.length ? (
            <div style={{
              background: '#fff', borderRadius: 20, padding: 60,
              textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,.06)'
            }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#212121', marginBottom: 8 }}>Your cart is empty</h3>
              <p style={{ fontSize: 13, color: '#9E9E9E', marginBottom: 24 }}>Add some products to get started</p>
              <Link href="/products" style={{
                background: 'linear-gradient(135deg, #00BCD4, #00ACC1)',
                color: '#fff', textDecoration: 'none', padding: '12px 28px',
                borderRadius: 10, fontSize: 13, fontWeight: 700
              }}>Browse Products</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

              {/* Cart Items */}
              <div style={{ flex: 1 }}>
                <div style={{
                  background: '#fff', borderRadius: 20,
                  boxShadow: '0 2px 12px rgba(0,0,0,.06)', overflow: 'hidden'
                }}>
                  {cart.items.map((item, i) => (
                    <div key={item.product?._id} style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '20px 24px',
                      borderBottom: i < cart.items.length - 1 ? '1px solid #F5F5F5' : 'none'
                    }}>
                      {/* Image */}
                      <div style={{
                        width: 72, height: 72, borderRadius: 12, overflow: 'hidden',
                        background: '#F5F5F5', flexShrink: 0
                      }}>
                        {item.product?.images?.[0] ? (
                          <img
                            src={`http://localhost:4000${item.product.images[0]}`}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📦</div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#00BCD4', textTransform: 'uppercase', letterSpacing: .5 }}>
                          {item.product?.category?.name || 'Product'}
                        </span>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#212121', margin: '3px 0 10px' }}>
                          {item.product?.name}
                        </h3>
                        {/* Quantity Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            style={{
                              width: 28, height: 28, border: '1.5px solid #E0E0E0',
                              borderRadius: '8px 0 0 8px', background: '#fff',
                              cursor: 'pointer', fontSize: 16, color: '#424242',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>−</button>
                          <div style={{
                            width: 36, height: 28, border: '1.5px solid #E0E0E0',
                            borderLeft: 'none', borderRight: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 600
                          }}>{item.quantity}</div>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            style={{
                              width: 28, height: 28, border: '1.5px solid #E0E0E0',
                              borderRadius: '0 8px 8px 0', background: '#fff',
                              cursor: 'pointer', fontSize: 16, color: '#424242',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>+</button>
                        </div>
                      </div>

                      {/* Price + Delete */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#BDBDBD', fontSize: 18, padding: 0,
                            transition: '.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#F44336'}
                          onMouseLeave={e => e.currentTarget.style.color = '#BDBDBD'}
                        >🗑</button>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div style={{ marginTop: 16 }}>
                  <Link href="/products" style={{
                    fontSize: 13, color: '#00BCD4', fontWeight: 600,
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6
                  }}>← Continue Shopping</Link>
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ width: 320, flexShrink: 0 }}>
                <div style={{
                  background: '#fff', borderRadius: 20, padding: 24,
                  boxShadow: '0 2px 12px rgba(0,0,0,.06)'
                }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#212121', marginBottom: 24 }}>
                    Order Summary
                  </h2>

                  {[
                    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                    { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`, free: shipping === 0 },
                    { label: 'Tax', value: `$${tax.toFixed(2)}` },
                    ...(discount > 0 ? [{ label: 'Discount', value: `-$${discount.toFixed(2)}`, discount: true }] : []),
                  ].map(row => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 14
                    }}>
                      <span style={{ fontSize: 13, color: '#616161' }}>{row.label}</span>
                      <span style={{
                        fontSize: 13, fontWeight: 600,
                        color: row.free ? '#4CAF50' : row.discount ? '#F44336' : '#212121'
                      }}>{row.value}</span>
                    </div>
                  ))}

                  <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>Total</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: '#00838F' }}>
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#424242', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>
                      Promo Code
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="FRESH20"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        style={{
                          flex: 1, padding: '10px 14px',
                          border: '1.5px solid #E0E0E0', borderRadius: 10,
                          fontSize: 13, fontFamily: 'Poppins, sans-serif',
                          outline: 'none', letterSpacing: 1
                        }}
                        onFocus={e => e.target.style.borderColor = '#00BCD4'}
                        onBlur={e => e.target.style.borderColor = '#E0E0E0'}
                      />
                      <button
                        onClick={applyPromo}
                        style={{
                          padding: '10px 16px', background: '#00BCD4',
                          color: '#fff', border: 'none', borderRadius: 10,
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          fontFamily: 'Poppins, sans-serif'
                        }}>Apply</button>
                    </div>
                    {promoMsg && (
                      <p style={{
                        fontSize: 12, marginTop: 6,
                        color: discount > 0 ? '#4CAF50' : '#F44336'
                      }}>{promoMsg}</p>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout" style={{
                    display: 'block', width: '100%', padding: '14px',
                    background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                    color: '#fff', border: 'none', borderRadius: 12,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif', textAlign: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 6px 20px rgba(0,188,212,.3)'
                  }}>
                    Proceed to Checkout
                  </Link>

                  <p style={{ textAlign: 'center', fontSize: 11, color: '#9E9E9E', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                     Secure checkout powered by Stripe
                  </p>

                  {subtotal > 0 && subtotal <= 150 && (
                    <div style={{
                      marginTop: 16, background: '#E0F7FA', borderRadius: 10,
                      padding: '10px 14px', fontSize: 12, color: '#00838F',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}>
                       Add ${(150 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                  )}
                  {subtotal > 150 && (
                    <div style={{
                      marginTop: 16, background: '#E8F5E9', borderRadius: 10,
                      padding: '10px 14px', fontSize: 12, color: '#2E7D32',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}>
                       Free shipping applied!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}