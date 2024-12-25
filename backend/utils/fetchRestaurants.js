const axios = require('axios');

const fetchRestaurantsFromYelp = async (location, cuisine) => {
  const API_KEY = '0uCbMNs-0uF7oZq5mEtgV_Mc5SKl6K_ncIjvN8a-ItOw6nAfSvRjKHjZkAskjH3vGONvKJThhcgg9EEcmJGz-PoG4nRTet8r9sBcjKzpVygWEEWqSg4xRPv13UtrZ3Yx'; // Replace with your actual Yelp API key
  const API_URL = 'https://api.yelp.com/v3/businesses/search';

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      params: {
        location,
        term: cuisine || 'restaurants',
        limit: 20,
        sort_by: 'best_match',
      },
    });

    // Extract relevant data
    const restaurants = response.data.businesses.map((business) => ({
      name: business.name,
      address: business.location.address1,
      city: business.location.city,
      cuisine: cuisine || 'General',
      rating: business.rating,
    }));

    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants from Yelp:', error.response?.data || error.message);
    throw new Error('Failed to fetch restaurants from Yelp');
  }
};

module.exports = fetchRestaurantsFromYelp;
