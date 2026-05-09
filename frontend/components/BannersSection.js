export default function BannersSection() {
  return (
    <section style={{ padding: '0 40px 48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{
          borderRadius: 16, padding: 32, minHeight: 200,
          position: 'relative', overflow: 'hidden', cursor: 'pointer',
          background: 'linear-gradient(135deg,#00BCD4,#00838F)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }}>
          <span style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', fontSize: 80, opacity: .3 }}>
            🖥️
          </span>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            Tech Deals
          </h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', marginBottom: 16, lineHeight: 1.5 }}>
            Latest electronics and gadgets at unbeatable prices. Upgrade your tech today.
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#fff', color: '#00838F', fontSize: 12,
            fontWeight: 600, padding: '8px 16px', borderRadius: 6, width: 'fit-content'
          }}>Shop Electronics →</div>
        </div>

        <div style={{
          borderRadius: 16, padding: 32, minHeight: 200,
          position: 'relative', overflow: 'hidden', cursor: 'pointer',
          background: 'linear-gradient(135deg,#26C6DA,#0097A7)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }}>
          <span style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', fontSize: 80, opacity: .3 }}>
            👗
          </span>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            Fashion Sale
          </h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', marginBottom: 16, lineHeight: 1.5 }}>
            New season arrivals with up to 50% off. Refresh your wardrobe now.
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#fff', color: '#00838F', fontSize: 12,
            fontWeight: 600, padding: '8px 16px', borderRadius: 6, width: 'fit-content'
          }}>Shop Fashion →</div>
        </div>
      </div>
    </section>
  );
}