import React, { useEffect, useState } from 'react';
import { createReservation, getMyReservations } from '../services/api.js';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [partySize, setPartySize] = useState(2);

  const token = localStorage.getItem('token');

  const fetchReservations = async () => {
    const data = await getMyReservations(token);
    setReservations(data);
  };

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token]);

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      await createReservation(token, {
        restaurant_id: restaurantId,
        reservation_time: reservationTime,
        party_size: partySize,
      });
      fetchReservations();
      setRestaurantId('');
      setReservationTime('');
      setPartySize(2);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>My Reservations</h2>
      <ul>
        {reservations.map((res) => (
          <li key={res.id}>
            {res.restaurant_name} - {res.reservation_time} (Party of {res.party_size})
          </li>
        ))}
      </ul>
      <hr />
      <h3>Create a new Reservation</h3>
      <form onSubmit={handleReservation}>
        <label>Restaurant ID:</label>
        <input
          type="text"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
        />
        <br />
        <label>Reservation Time:</label>
        <input
          type="datetime-local"
          value={reservationTime}
          onChange={(e) => setReservationTime(e.target.value)}
        />
        <br />
        <label>Party Size:</label>
        <input
          type="number"
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        />
        <br />
        <button type="submit">Reserve</button>
      </form>
    </div>
  );
}

export default Reservations;
