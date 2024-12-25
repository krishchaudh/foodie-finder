import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurant, getReviewsByRestaurant, createReview } from '../services/api.js';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        const restData = await getRestaurant(id);
        setRestaurant(restData);
        const revData = await getReviewsByRestaurant(id);
        setReviews(revData);
      } catch (err) {
        console.error(err);
        setError('Failed to load data. Please try again later.');
      }
    })();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (rating < 1 || rating > 5 || comment.trim() === '') {
      alert('Please provide a valid rating and comment.');
      return;
    }
    try {
      await createReview(token, {
        restaurant_id: id,
        rating,
        comment,
      });
      const revData = await getReviewsByRestaurant(id);
      setReviews(revData);
      setRating(5);
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <p>{error}</p>;
  if (!restaurant) return <p>Loading...</p>;

  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>
        {restaurant.address}, {restaurant.city}
      </p>
      <p>Cuisine: {restaurant.cuisine}</p>
      <p>Average Rating: {restaurant.rating}</p>
      <hr />
      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to leave one!</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev.id}>
            <strong>{rev.username}:</strong> {rev.comment} (Rating: {rev.rating})
          </div>
        ))
      )}
      {token && (
        <form onSubmit={handleReviewSubmit}>
          <label>Rating (1-5): </label>
          <input
            type="number"
            value={rating}
            min="1"
            max="5"
            onChange={(e) => setRating(e.target.value)}
          />
          <br />
          <label>Comment: </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <br />
          <button type="submit" disabled={!token}>
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
}

export default RestaurantDetail;
