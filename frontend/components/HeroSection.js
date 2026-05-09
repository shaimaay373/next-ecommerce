import Link from 'next/link';

export default function HeroSection() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #E0F7FA 0%, #fff 60%)',
      padding: '60px 40px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      gap: 40, minHeight: 380, position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', right: -60, top: -60,
        width: 400, height: 400, background: '#B2EBF2',
        borderRadius: '50%', opacity: .3
      }} />

      <div style={{ flex: 1, maxWidth: 520, position: 'relative', zIndex: 1 }}>
        <span style={{
          display: 'inline-block', background: '#00BCD4', color: '#fff',
          fontSize: 11, fontWeight: 600, padding: '4px 12px',
          borderRadius: 20, marginBottom: 16, letterSpacing: .5
        }}>Limited Time Offer</span>

        <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
          Shop Everything<br />You Need
        </h1>

        <p style={{
          fontSize: 14, color: '#616161', lineHeight: 1.7,
          marginBottom: 28, maxWidth: 420
        }}>
          Discover thousands of products across electronics, fashion, home & more.
          Fast delivery, great prices, and quality you can trust.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/products" style={{
            background: '#00BCD4', color: '#fff', border: 'none',
            padding: '12px 24px', borderRadius: 8, fontSize: 14,
            fontWeight: 600, textDecoration: 'none', display: 'inline-block'
          }}>Shop Now</Link>

          <Link href="/products?sort=rating" style={{
            background: 'transparent', color: '#00BCD4',
            border: '1.5px solid #00BCD4', padding: '12px 24px',
            borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none'
          }}>Top Rated</Link>
        </div>
      </div>

      <div style={{
        flex: 1, maxWidth: 480, borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,188,212,.15)', position: 'relative', zIndex: 1,
        background: 'linear-gradient(135deg, #00BCD4, #00838F)',
        height: 280, display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 24, fontSize: 72
      }}>
        🖥️👗🏠📚
      </div>
    </div>
  );
}