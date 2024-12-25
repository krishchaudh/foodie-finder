import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Reservations from './pages/Reservations';
import PrivateRoute from './components/PrivateRoute';

// Debugging logs
console.log('NavBar:', NavBar);
console.log('Home:', Home);
console.log('Login:', Login);
console.log('Signup:', Signup);
console.log('Restaurants:', Restaurants);
console.log('RestaurantDetail:', RestaurantDetail);
console.log('Reservations:', Reservations);
console.log('PrivateRoute:', PrivateRoute);

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container" style={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route
            path="/reservations"
            element={
              <PrivateRoute>
                <Reservations />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
