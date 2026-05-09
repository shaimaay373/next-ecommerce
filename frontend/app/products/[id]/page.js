'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/products/${id}`)
      .then(res => { setProduct(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      await axios.post('http://localhost:4000/api/cart',
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to cart!');
    } catch { alert('Failed to add to cart'); }
  };

  const addToWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      await axios.post(`http://localhost:4000/api/wishlist/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to wishlist!');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    setSubmittingReview(true);
    try {
      const res = await axios.post(
        `http://localhost:4000/api/products/${id}/reviews`,
        review,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProduct(res.data.data);
      setReview({ rating: 5, comment: '' });
    } catch (err) { alert(err.response?.data?.message || 'Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 80, fontFamily: 'Poppins, sans-serif', color: '#9E9E9E' }}>
        Loading product...
      </div>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 80, fontFamily: 'Poppins, sans-serif', color: '#9E9E9E' }}>
        Product not found
      </div>
      <Footer />
    </>
  );

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    star: r,
    count: product.ratings?.filter(rv => rv.rating === r).length || 0,
    percent: product.ratings?.length
      ? Math.round((product.ratings.filter(rv => rv.rating === r).length / product.ratings.length) * 100)
      : 0
  }));

  return (
    <>
      <Navbar />
      <div style={{ background: '#F5F5F5', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

          {/* Product Card */}
          <div style={{
            background: '#fff', borderRadius: 20, padding: 32,
            boxShadow: '0 2px 16px rgba(0,0,0,.06)', display: 'flex', gap: 40, marginBottom: 24
          }}>
            {/* Images */}
            <div style={{ flex: '0 0 320px' }}>
              <div style={{
                borderRadius: 16, overflow: 'hidden', marginBottom: 16,
                height: 320, background: '#F0F0F0', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                {product.images?.[selectedImage] ? (
                  <img
                    src={`http://localhost:4000${product.images[selectedImage]}`}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ fontSize: 80, color: '#E0E0E0' }}>📦</div>
                )}
              </div>
              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {product.images.map((img, i) => (
                    <div key={i}
                      onClick={() => setSelectedImage(i)}
                      style={{
                        width: 64, height: 64, borderRadius: 10, overflow: 'hidden',
                        border: `2px solid ${selectedImage === i ? '#00BCD4' : '#E0E0E0'}`,
                        cursor: 'pointer', flexShrink: 0
                      }}>
                      <img src={`http://localhost:4000${img}`} alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <span style={{
                display: 'inline-block', background: '#E0F7FA', color: '#00838F',
                fontSize: 11, fontWeight: 600, padding: '4px 12px',
                borderRadius: 20, marginBottom: 12
              }}>
                {product.category?.name || 'Premium Collection'}
              </span>

              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#212121', marginBottom: 10, lineHeight: 1.3 }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ color: '#FFC107', fontSize: 18 }}>
                  {'★'.repeat(Math.round(product.averageRating || 0))}
                  {'☆'.repeat(5 - Math.round(product.averageRating || 0))}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#212121' }}>
                  {product.averageRating?.toFixed(1) || '0.0'}
                </span>
                <span style={{ fontSize: 13, color: '#9E9E9E' }}>
                  ({product.ratings?.length || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#00838F' }}>
                  ${product.price}
                </span>
              </div>

              {/* Stock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                <span style={{ fontSize: 16 }}>{product.stock > 0 ? '' : '❌'}</span>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: product.stock > 0 ? '#4CAF50' : '#F44336'
                }}>
                  {product.stock > 0 ? `In Stock & Ready to Ship (${product.stock} left)` : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: '#616161', lineHeight: 1.8, marginBottom: 24, maxWidth: 460 }}>
                {product.description}
              </p>

              {/* Quantity + Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#9E9E9E', marginBottom: 6 }}>Total Price</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      border: '1.5px solid #E0E0E0', borderRadius: 10, padding: '6px 14px'
                    }}>
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{
                        background: 'none', border: 'none', fontSize: 20,
                        cursor: 'pointer', color: '#424242', fontWeight: 300
                      }}>−</button>
                      <span style={{ fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} style={{
                        background: 'none', border: 'none', fontSize: 20,
                        cursor: 'pointer', color: '#424242', fontWeight: 300
                      }}>+</button>
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#00838F' }}>
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  style={{
                    flex: 1, padding: '14px 24px',
                    background: product.stock === 0 ? '#E0E0E0' : 'linear-gradient(135deg, #00BCD4, #00ACC1)',
                    color: '#fff', border: 'none', borderRadius: 12,
                    fontSize: 14, fontWeight: 700, cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: product.stock === 0 ? 'none' : '0 6px 20px rgba(0,188,212,.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}>
                  🛒 Add to Cart
                </button>
                <button
                  onClick={addToWishlist}
                  style={{
                    flex: 1, padding: '14px 24px',
                    background: '#fff', color: '#00BCD4',
                    border: '2px solid #00BCD4', borderRadius: 12,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}>
                  🤍 Add to Wishlist
                </button>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', gap: 24, marginTop: 24, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                {[
                  { icon: '🌿', label: '100% Organic' },
                  { icon: '🚚', label: 'Free Shipping' },
                  { icon: '✔️', label: 'Certified' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 24 }}>{f.icon}</span>
                    <span style={{ fontSize: 11, color: '#616161', fontWeight: 500 }}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div style={{
            background: '#fff', borderRadius: 20, padding: 32,
            boxShadow: '0 2px 16px rgba(0,0,0,.06)'
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28, color: '#212121' }}>
              Customer Reviews
            </h2>

            <div style={{ display: 'flex', gap: 40 }}>
              {/* Rating Summary */}
              <div style={{
                flex: '0 0 200px', background: '#F9F9F9',
                borderRadius: 16, padding: 24, textAlign: 'center'
              }}>
                <div style={{ fontSize: 52, fontWeight: 800, color: '#212121' }}>
                  {product.averageRating?.toFixed(1) || '0.0'}
                </div>
                <div style={{ color: '#FFC107', fontSize: 20, margin: '8px 0' }}>
                  {'★'.repeat(Math.round(product.averageRating || 0))}
                  {'☆'.repeat(5 - Math.round(product.averageRating || 0))}
                </div>
                <div style={{ fontSize: 12, color: '#9E9E9E', marginBottom: 20 }}>
                  Based on {product.ratings?.length || 0} reviews
                </div>
                {ratingCounts.map(r => (
                  <div key={r.star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#616161', width: 8 }}>{r.star}</span>
                    <div style={{ flex: 1, height: 6, background: '#E0E0E0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${r.percent}%`, height: '100%', background: '#00BCD4', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#9E9E9E', width: 28 }}>{r.percent}%</span>
                  </div>
                ))}
              </div>

              {/* Reviews List */}
              <div style={{ flex: 1 }}>
                {product.ratings?.length === 0 ? (
                  <div style={{ color: '#9E9E9E', fontSize: 14, padding: '20px 0' }}>
                    No reviews yet. Be the first to review!
                  </div>
                ) : (
                  product.ratings?.map((r, i) => (
                    <div key={i} style={{
                      padding: '20px 0', borderBottom: i < product.ratings.length - 1 ? '1px solid #F0F0F0' : 'none'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #00BCD4, #00838F)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 14, fontWeight: 700
                          }}>
                            {r.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#212121' }}>
                              {r.user?.name || 'Anonymous'}
                            </div>
                            <div style={{ fontSize: 11, color: '#9E9E9E' }}>Verified Buyer</div>
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: '#9E9E9E' }}>
                          {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ color: '#FFC107', fontSize: 14, marginBottom: 8 }}>
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </div>
                      <p style={{ fontSize: 13, color: '#616161', lineHeight: 1.7 }}>{r.comment}</p>
                    </div>
                  ))
                )}

                {/* Add Review Form */}
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#212121' }}>
                    Write a Review
                  </h3>
                  <form onSubmit={submitReview}>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 8 }}>
                        Rating
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} type="button"
                            onClick={() => setReview({ ...review, rating: s })}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: 28, color: s <= review.rating ? '#FFC107' : '#E0E0E0'
                            }}>★</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#424242', display: 'block', marginBottom: 8 }}>
                        Comment
                      </label>
                      <textarea
                        value={review.comment}
                        onChange={e => setReview({ ...review, comment: e.target.value })}
                        placeholder="Share your experience with this product..."
                        rows={4}
                        required
                        style={{
                          width: '100%', padding: '12px 14px',
                          border: '2px solid #F0F0F0', borderRadius: 12,
                          fontSize: 13, fontFamily: 'Poppins, sans-serif',
                          outline: 'none', resize: 'vertical', boxSizing: 'border-box'
                        }}
                        onFocus={e => e.target.style.borderColor = '#00BCD4'}
                        onBlur={e => e.target.style.borderColor = '#F0F0F0'}
                      />
                    </div>
                    <button type="submit" disabled={submittingReview} style={{
                      padding: '12px 28px',
                      background: 'linear-gradient(135deg, #00BCD4, #00ACC1)',
                      color: '#fff', border: 'none', borderRadius: 10,
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      boxShadow: '0 4px 14px rgba(0,188,212,.3)'
                    }}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}