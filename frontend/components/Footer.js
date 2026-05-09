export default function Footer() {
  return (
    <footer style={{ background: '#212121', color: '#fff', padding: '48px 40px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#00BCD4' }}>
            Fresh<span style={{ color: '#fff' }}>Cart</span>
          </div>
          <p style={{ fontSize: 13, color: '#9E9E9E', lineHeight: 1.7, marginTop: 12, maxWidth: 240 }}>
            The freshest products delivered to your doorstep. Experience the future of e-commerce today.
          </p>
        </div>

        {[
          { title: 'Quick Links', links: ['About Us', 'Shipping Info', 'Return Policy', 'Privacy'] },
          { title: 'Support', links: ['Help Center', 'Track Order', 'Contact Us', 'FAQ'] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{col.title}</h4>
            <ul style={{ listStyle: 'none' }}>
              {col.links.map(link => (
                <li key={link} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ color: '#9E9E9E', textDecoration: 'none', fontSize: 12 }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Newsletter</h4>
          <p style={{ fontSize: 12, color: '#9E9E9E', marginBottom: 12 }}>Subscribe for the latest deals and fresh updates.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email" placeholder="Your email address"
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 6, border: 'none',
                background: '#424242', color: '#fff', fontSize: 12, fontFamily: 'Poppins, sans-serif'
              }}
            />
            <button style={{
              background: '#00BCD4', color: '#fff', border: 'none',
              padding: '10px 16px', borderRadius: 6, fontSize: 12,
              fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
            }}>Subscribe</button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #424242', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: '#9E9E9E' }}>© 2024 FreshCart. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          {['f', 'in', 'tw'].map(s => (
            <div key={s} style={{
              width: 32, height: 32, background: '#424242', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, cursor: 'pointer', color: '#fff'
            }}>{s}</div>
          ))}
        </div>
      </div>
    </footer>
  );
}