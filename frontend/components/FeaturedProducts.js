'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/products?sort=rating')
      .then(res => setProducts(res.data.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <section style={{ padding: '0 40px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Featured Products</h2>
        <Link href="/products" style={{ color: '#00BCD4', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {products.map(product => (
          <Link key={product._id} href={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              background: '#fff', border: '1.5px solid #E0E0E0',
              borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: '.3s'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#00BCD4';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,188,212,.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E0E0E0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                height: 180, background: '#F5F5F5',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', position: 'relative', fontSize: 64
              }}>
                {product.images?.[0]
                  ? <img src={`http://localhost:4000${product.images[0]}`} alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : '📦'}
                <span style={{
                  position: 'absolute', top: 10, left: 10,
                  background: '#00BCD4', color: '#fff', fontSize: 9,
                  fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                  letterSpacing: .5, textTransform: 'uppercase'
                }}>{product.category?.name || 'Product'}</span>
              </div>

              <div style={{ padding: 14 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{product.name}</h3>
                <div style={{ color: '#FFC107', fontSize: 11, marginBottom: 8 }}>
                  {'★'.repeat(Math.round(product.averageRating || 0))}
                  {'☆'.repeat(5 - Math.round(product.averageRating || 0))}
                  <span style={{ color: '#616161', marginLeft: 4 }}>({product.ratings?.length || 0} reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#00838F' }}>${product.price}</span>
                  <button style={{
                    width: 34, height: 34, background: '#00BCD4', border: 'none',
                    borderRadius: 8, color: '#fff', fontSize: 18, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>+</button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}