import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '70vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: 'Poppins, sans-serif',
        background: '#F5F5F5'
      }}>
        <div style={{
          background: '#fff', borderRadius: 24, padding: '60px 48px',
          textAlign: 'center', boxShadow: '0 2px 20px rgba(0,0,0,.06)',
          maxWidth: 440
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#212121', marginBottom: 10 }}>
            Order Placed!
          </h1>
          <p style={{ fontSize: 13, color: '#9E9E9E', lineHeight: 1.7, marginBottom: 28 }}>
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/profile" style={{
              background: 'linear-gradient(135deg, #00BCD4, #00ACC1)',
              color: '#fff', textDecoration: 'none', padding: '12px 24px',
              borderRadius: 10, fontSize: 13, fontWeight: 700
            }}>View Orders</Link>
            <Link href="/products" style={{
              background: '#fff', color: '#00BCD4',
              textDecoration: 'none', padding: '12px 24px',
              borderRadius: 10, fontSize: 13, fontWeight: 700,
              border: '2px solid #00BCD4'
            }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}