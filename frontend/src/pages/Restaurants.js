import React, { useState, useEffect } from 'react';
import { getAllRestaurants } from '../services/api.js';

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisine, setCuisine] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllRestaurants(cuisine);
        console.log('API Response:', data); // Debugging the response
        setRestaurants(data); // Ensure this is an array
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    })();
  }, [cuisine]);

  return (
    <div>
      <h2>Restaurants</h2>
      <label>Filter by cuisine: </label>
      <input
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
        placeholder="e.g. Italian"
      />
      <ul>
        {restaurants.map((r) => (
          <li key={r.id}>
            {r.name} - {r.city} - {r.cuisine} (Avg Rating: {r.rating})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Restaurants;
