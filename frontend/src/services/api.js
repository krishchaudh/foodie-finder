import axios from 'axios';

// Adjust if using Docker or a cloud service:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const handleError = (error) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error; // Rethrow for the caller to handle
};

export const registerUser = async (username, email, password) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/register`, { username, email, password });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllRestaurants = async (cuisine = '') => {
  try {
    console.log('Making API request to fetch restaurants:', cuisine);
    const { data } = await axios.get(`${API_BASE_URL}/restaurants?cuisine=${cuisine}`);
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error in getAllRestaurants:', error.response?.data || error.message);
    return []; // Return an empty array to prevent crashes
  }
};



export const getRestaurant = async (id) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/restaurants/${id}`);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const createReservation = async (token, reservation) => {
  try {
    if (!token) throw new Error('Authorization token is required');
    const { data } = await axios.post(`${API_BASE_URL}/reservations`, reservation, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getMyReservations = async (token) => {
  try {
    if (!token) throw new Error('Authorization token is required');
    const { data } = await axios.get(`${API_BASE_URL}/reservations/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const createReview = async (token, review) => {
  try {
    if (!token) throw new Error('Authorization token is required');
    const { data } = await axios.post(`${API_BASE_URL}/reviews`, review, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getReviewsByRestaurant = async (restaurantId) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/reviews/${restaurantId}`);
    return data;
  } catch (error) {
    handleError(error);
  }
};
