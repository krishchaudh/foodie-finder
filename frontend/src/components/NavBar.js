import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ background: '#eee', padding: '1rem' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>
        Home
      </Link>
      <Link to="/restaurants" style={{ marginRight: '1rem' }}>
        Restaurants
      </Link>
      {token ? (
        <>
          <Link to="/reservations" style={{ marginRight: '1rem' }}>
            My Reservations
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>
            Login
          </Link>
          <Link to="/signup" style={{ marginRight: '1rem' }}>
            Signup
          </Link>
        </>
      )}
    </nav>
  );
}

export default NavBar;
