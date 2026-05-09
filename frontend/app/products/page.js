'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('recommended');

  useEffect(() => {
    axios.get('http://localhost:4000/api/categories')
      .then(res => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:4000/api/products?';
      if (search) url += `search=${search}&`;
      if (selectedCategory) url += `category=${selectedCategory}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;
      if (sort === 'price_asc') url += `sort=price_asc&`;
      if (sort === 'price_desc') url += `sort=price_desc&`;
      if (sort === 'rating') url += `sort=rating&`;
      const res = await axios.get(url);
      setProducts(res.data.data);
    } catch { } finally { setLoading(false); }
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      await axios.post('http://localhost:4000/api/cart',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to cart!');
    } catch { alert('Failed to add to cart'); }
  };

  return (
    <>
      <Navbar />
      <div style={{ background: '#F5F5F5', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px', display: 'flex', gap: 24 }}>

          {/* SIDEBAR */}
          <div style={{ width: 240, flexShrink: 0 }}>
            {/* Filters Card */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,.06)', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#212121' }}>Filters</h3>

              {/* Category */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#424242', marginBottom: 12 }}>Category</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#616161', cursor: 'pointer' }}>
                    <input
                      type="radio" name="category" value=""
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      style={{ accentColor: '#00BCD4' }}
                    />
                    All Categories
                  </label>
                  {categories.map(cat => (
                    <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#616161', cursor: 'pointer' }}>
                      <input
                        type="radio" name="category" value={cat._id}
                        checked={selectedCategory === cat._id}
                        onChange={() => setSelectedCategory(cat._id)}
                        style={{ accentColor: '#00BCD4' }}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#424242', marginBottom: 12 }}>Price Range</h4>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="number" placeholder="Min" value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px', border: '1.5px solid #E0E0E0',
                      borderRadius: 8, fontSize: 12, fontFamily: 'Poppins, sans-serif',
                      outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="number" placeholder="Max" value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px', border: '1.5px solid #E0E0E0',
                      borderRadius: 8, fontSize: 12, fontFamily: 'Poppins, sans-serif',
                      outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#424242', marginBottom: 12 }}>Customer Rating</h4>
                {[4, 3, 2].map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#616161', cursor: 'pointer', marginBottom: 8 }}>
                    <input type="radio" name="rating" style={{ accentColor: '#00BCD4' }} />
                    <span style={{ color: '#FFC107' }}>{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                    <span style={{ fontSize: 11 }}> & up</span>
                  </label>
                ))}
              </div>

              <button
                onClick={fetchProducts}
                style={{
                  width: '100%', padding: '10px', background: 'linear-gradient(135deg, #00BCD4, #00ACC1)',
                  color: '#fff', border: 'none', borderRadius: 10, fontSize: 13,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
                }}>
                Apply Filters
              </button>
            </div>

            {/* Promo Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #00BCD4, #00838F)',
              borderRadius: 16, padding: 20, color: '#fff'
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Weekend Sale!</div>
              <div style={{ fontSize: 11, opacity: .85, marginBottom: 12, lineHeight: 1.5 }}>
                Get up to 40% off on selected items this weekend only.
              </div>
              <button style={{
                background: '#fff', color: '#00838F', border: 'none',
                padding: '7px 14px', borderRadius: 6, fontSize: 11,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
              }}>Shop Now</button>
            </div>
          </div>

          {/* MAIN */}
          <div style={{ flex: 1 }}>
            {/* Search + Sort */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9E9E9E', fontSize: 16 }}>🔍</span>
                <input
                  type="text" placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchProducts()}
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px',
                    border: '1.5px solid #E0E0E0', borderRadius: 12,
                    fontSize: 13, fontFamily: 'Poppins, sans-serif',
                    outline: 'none', background: '#fff', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#00BCD4'}
                  onBlur={e => e.target.style.borderColor = '#E0E0E0'}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#616161', whiteSpace: 'nowrap' }}>Sort by</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{
                    padding: '10px 14px', border: '1.5px solid #E0E0E0',
                    borderRadius: 10, fontSize: 12, fontFamily: 'Poppins, sans-serif',
                    outline: 'none', background: '#fff', cursor: 'pointer'
                  }}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9E9E9E', fontSize: 14 }}>
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9E9E9E', fontSize: 14 }}>
                No products found
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {products.map(product => (
                  <div key={product._id} style={{
                    background: '#fff', borderRadius: 14, overflow: 'hidden',
                    border: '1.5px solid #F0F0F0', transition: '.3s',
                    boxShadow: '0 2px 8px rgba(0,0,0,.04)'
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#00BCD4';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,188,212,.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#F0F0F0';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.04)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Link href={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ position: 'relative', height: 180, background: '#F9F9F9', overflow: 'hidden' }}>
                        {product.images?.[0] ? (
                          <img
                            src={`http://localhost:4000${product.images[0]}`}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E0F7FA', fontSize: 48 }}>
                            📦
                          </div>
                        )}
                        {product.stock < 10 && product.stock > 0 && (
                          <span style={{
                            position: 'absolute', top: 10, left: 10,
                            background: '#FF9800', color: '#fff', fontSize: 9,
                            fontWeight: 700, padding: '3px 8px', borderRadius: 4
                          }}>LOW STOCK</span>
                        )}
                        {product.stock === 0 && (
                          <span style={{
                            position: 'absolute', top: 10, left: 10,
                            background: '#F44336', color: '#fff', fontSize: 9,
                            fontWeight: 700, padding: '3px 8px', borderRadius: 4
                          }}>OUT OF STOCK</span>
                        )}
                      </div>

                      <div style={{ padding: '14px 14px 0' }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: '#00BCD4',
                          textTransform: 'uppercase', letterSpacing: .5
                        }}>{product.category?.name || 'Product'}</span>
                        <h3 style={{ fontSize: 13, fontWeight: 600, margin: '4px 0', color: '#212121', lineHeight: 1.4 }}>
                          {product.name}
                        </h3>
                        <div style={{ fontSize: 11, color: '#FFC107', marginBottom: 4 }}>
                          {'★'.repeat(Math.round(product.averageRating || 0))}
                          {'☆'.repeat(5 - Math.round(product.averageRating || 0))}
                          <span style={{ color: '#9E9E9E', marginLeft: 4 }}>({product.ratings?.length || 0})</span>
                        </div>
                      </div>
                    </Link>

                    <div style={{ padding: '8px 14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#00838F' }}>${product.price}</span>
                      <button
                        onClick={() => addToCart(product._id)}
                        disabled={product.stock === 0}
                        style={{
                          width: 34, height: 34, background: product.stock === 0 ? '#E0E0E0' : '#00BCD4',
                          border: 'none', borderRadius: '50%', color: '#fff',
                          fontSize: 20, cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 300, lineHeight: 1
                        }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}