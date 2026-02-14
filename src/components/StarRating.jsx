import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 16 }) => {
  return (
    <div style={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= rating ? "#FFA41C" : "none"}
          color={star <= rating ? "#FFA41C" : "#ddd"}
          style={{ marginRight: '2px' }}
        />
      ))}
    </div>
  );
};

export default StarRating;
