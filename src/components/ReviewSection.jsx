import React, { useState } from 'react';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const ReviewSection = ({ productId, reviews, onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Calculate average
  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please sign in to write a review.');
    
    setSubmitting(true);
    
    try {
      // Optimistic update or call parent to refresh
      // For now, let's pretend we saved it to Supabase
      // In a real app: await supabase.from('reviews').insert(...)
      
      const newReview = {
        id: Date.now(),
        user: user.email?.split('@')[0] || 'User',
        rating,
        comment,
        date: new Date().toISOString().split('T')[0]
      };
      
      onReviewAdded(newReview);
      setComment('');
      setRating(5);
      
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviews-section" style={{ marginTop: '40px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Customer Reviews</h2>
      
      <div className="rating-summary" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <StarRating rating={Math.round(averageRating)} size={24} />
        <span style={{ fontSize: '18px' }}>{averageRating} out of 5</span>
        <span style={{ color: '#565959' }}>({reviews ? reviews.length : 0} global ratings)</span>
      </div>

      {/* Review List */}
      <div className="review-list">
        {reviews && reviews.map((review) => (
          <div key={review.id} className="review-item" style={{ marginBottom: '20px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ddd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {review.user.charAt(0).toUpperCase()}
                </div>
                <strong>{review.user}</strong>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                <StarRating rating={review.rating} size={14} />
                <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>Verified Purchase</span>
             </div>
             <p style={{ color: '#565959', fontSize: '12px' }}>Reviewed on {review.date}</p>
             <p style={{ marginTop: '5px' }}>{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Add Review Form */}
      <div className="add-review" style={{ marginTop: '30px', background: '#f8f8f8', padding: '20px', borderRadius: '8px' }}>
        <h3>Write a customer review</h3>
        {user ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>Overall rating</label>
              <select 
                value={rating} 
                onChange={(e) => setRating(parseInt(e.target.value))}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Add a written review</label>
              <textarea 
                rows="4" 
                style={{ width: '100%', padding: '10px' }} 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="What did you like or dislike? What did you use this product for?"
              />
            </div>
            <button 
              type="submit" 
              className="a-button-primary"
              disabled={submitting}
              style={{
                background: '#FFD814', 
                border: '1px solid #FCD200', 
                padding: '8px 16px', 
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Submit
            </button>
          </form>
        ) : (
          <p>Please <a href="/login" style={{color: '#007185'}}>sign in</a> to write a review.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
