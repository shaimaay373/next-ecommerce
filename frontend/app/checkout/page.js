'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [address, setAddress] = useState({ street: '', city: '', country: '' });
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    axios.get('http://localhost:4000/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => { setCart(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const subtotal = cart?.items?.reduce((acc, item) =>
    acc + (item.product?.price || 0) * item.quantity, 0) || 0;
  const shipping = subtotal > 150 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const placeOrder = async () => {
    if (!address.street || !address.city || !address.country) {
      alert('Please fill in all address fields'); return;
    }
    setPlacing(true);
    try {
      const items = cart.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }));
      await axios.post('http://localhost:4000/api/orders',
        { items, paymentMethod, address, email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push('/orders/success');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  const paymentMethods = [
    { id: 'credit_card', label: 'Credit Card', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
    { id: 'cod', label: 'Cash', icon: '💵' },
    { id: 'wallet', label: 'Wallet', icon: '👝' },
  ];

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E0E0E0', borderRadius: 10,
    fontSize: 13, fontFamily: 'Poppins, sans-serif',
    outline: 'none', boxSizing: 'border-box',
    background: '#fff', color: '#212121'
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

          {/* LEFT */}
          <div style={{ flex: 1 }}>

            {/* Delivery Address */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,.06)', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 28, height: 28, background: '#00BCD4', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 13, fontWeight: 700
                }}>1</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>Delivery Address</h2>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>
                  Street Address
                </label>
                <input
                  type="text" placeholder="123 Fresh Lane"
                  value={address.street}
                  onChange={e => setAddress({ ...address, street: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00BCD4'}
                  onBlur={e => e.target.style.borderColor = '#E0E0E0'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>
                    City
                  </label>
                  <input
                    type="text" placeholder="Organic City"
                    value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#00BCD4'}
                    onBlur={e => e.target.style.borderColor = '#E0E0E0'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>
                    Country
                  </label>
                  <select
                    value={address.country}
                    onChange={e => setAddress({ ...address, country: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#00BCD4'}
                    onBlur={e => e.target.style.borderColor = '#E0E0E0'}
                  >
                    <option value="">Select Country</option>
                    <option value="Egypt">Egypt</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="UAE">UAE</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 28, height: 28, background: '#00BCD4', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 13, fontWeight: 700
                }}>2</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#212121' }}>Payment Method</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {paymentMethods.map(pm => (
                  <button key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      padding: '16px 8px', border: `2px solid ${paymentMethod === pm.id ? '#00BCD4' : '#E0E0E0'}`,
                      borderRadius: 12, background: paymentMethod === pm.id ? '#E0F7FA' : '#fff',
                      cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      transition: '.2s'
                    }}>
                    <span style={{ fontSize: 24 }}>{pm.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: paymentMethod === pm.id ? '#00838F' : '#616161' }}>
                      {pm.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Card Details */}
              {paymentMethod === 'credit_card' && (
                <div style={{ background: '#F9F9F9', borderRadius: 14, padding: 20 }}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>
                      Card Number
                    </label>
                    <input
                      type="text" placeholder="XXXX XXXX XXXX XXXX"
                      value={cardDetails.number}
                      onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                      maxLength={19}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#00BCD4'}
                      onBlur={e => e.target.style.borderColor = '#E0E0E0'}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>
                        Expiry Date
                      </label>
                      <input
                        type="text" placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        maxLength={5}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#00BCD4'}
                        onBlur={e => e.target.style.borderColor = '#E0E0E0'}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 7 }}>
                        CVC
                      </label>
                      <input
                        type="text" placeholder="123"
                        value={cardDetails.cvc}
                        onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        maxLength={3}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#00BCD4'}
                        onBlur={e => e.target.style.borderColor = '#E0E0E0'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div style={{ background: '#F9F9F9', borderRadius: 14, padding: 20, textAlign: 'center', color: '#616161', fontSize: 13 }}>
                  💵 Pay with cash when your order is delivered.
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div style={{ background: '#F9F9F9', borderRadius: 14, padding: 20, textAlign: 'center', color: '#616161', fontSize: 13 }}>
                  👝 Your wallet balance will be used for this order.
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div style={{ background: '#F9F9F9', borderRadius: 14, padding: 20, textAlign: 'center', color: '#616161', fontSize: 13 }}>
                  🅿️ You will be redirected to PayPal to complete payment.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Order Summary */}
          <div style={{ width: 300, flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#212121', marginBottom: 20 }}>Order Summary</h2>

              {/* Items */}
              <div style={{ marginBottom: 20 }}>
                {cart?.items?.map(item => (
                  <div key={item.product?._id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 10, overflow: 'hidden',
                      background: '#F5F5F5', flexShrink: 0
                    }}>
                      {item.product?.images?.[0] ? (
                        <img
                          src={`http://localhost:4000${item.product.images[0]}`}
                          alt={item.product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#212121', lineHeight: 1.3 }}>
                        {item.product?.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#9E9E9E' }}>Qty: {item.quantity}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#212121' }}>
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
                {[
                  { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                  { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`, free: shipping === 0 },
                  { label: 'Taxes', value: `$${tax.toFixed(2)}` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: '#616161' }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: row.free ? '#4CAF50' : '#212121' }}>
                      {row.value}
                    </span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: '1px solid #F0F0F0' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#212121' }}>Total</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#00838F' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing}
                style={{
                  width: '100%', marginTop: 20, padding: '14px',
                  background: placing ? '#B2EBF2' : 'linear-gradient(135deg, #00BCD4, #00838F)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 14, fontWeight: 700, cursor: placing ? 'not-allowed' : 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: placing ? 'none' : '0 6px 20px rgba(0,188,212,.3)',
                  letterSpacing: .3
                }}>
                {placing ? 'Placing Order...' : 'PLACE ORDER'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 11, color: '#9E9E9E', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                🔒 Secure Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}