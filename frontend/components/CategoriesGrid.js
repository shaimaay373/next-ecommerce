'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const categoryEmojis = {
  'electronics': '🖥️',
  'fashion-&-clothing': '👗',
  'home-&-furniture': '🏠',
  'books': '📚',
  'beauty-&-personal-care': '💄',
  'sports': '⚽',
  'automotive': '🚗',
  'toys': '🧸',
};

const categoryColors = [
  'linear-gradient(135deg,#E0F7FA,#B2EBF2)',
  'linear-gradient(135deg,#FCE4EC,#F8BBD0)',
  'linear-gradient(135deg,#E8F5E9,#C8E6C9)',
  'linear-gradient(135deg,#FFF8E1,#FFECB3)',
  'linear-gradient(135deg,#EDE7F6,#D1C4E9)',
  'linear-gradient(135deg,#E3F2FD,#BBDEFB)',
  'linear-gradient(135deg,#FBE9E7,#FFCCBC)',
  'linear-gradient(135deg,#ECEFF1,#CFD8DC)',
];

export default function CategoriesGrid() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/categories')
      .then(res => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <section style={{ padding: '48px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Browse Categories</h2>
          <p style={{ fontSize: 13, color: '#616161', marginTop: 4 }}>
            Find exactly what you're looking for in our curated sections
          </p>
        </div>
        <Link href="/products" style={{ color: '#00BCD4', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          View All →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {categories.map((cat, i) => (
          <Link key={cat._id} href={`/products?category=${cat._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              style={{
                background: '#F5F5F5', borderRadius: 12, overflow: 'hidden',
                border: '1.5px solid transparent', transition: '.3s', cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#00BCD4';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,188,212,.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                height: 120, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 48,
                background: categoryColors[i % categoryColors.length],
                overflow: 'hidden'
              }}>
                {cat.image ? (
                  <img
                    src={`http://localhost:4000${cat.image}`}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  categoryEmojis[cat.slug] || '📦'
                )}
              </div>
              <div style={{ padding: '12px 16px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 600 }}>{cat.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}