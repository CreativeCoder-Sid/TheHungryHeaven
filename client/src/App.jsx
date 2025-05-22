import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Home from './components/Auth/Home';
import Navbarr from './components/Auth/Navbarr';
import Bengali from './components/Auth/Bengali';
import Chinese from './components/Auth/Chinese';
import South_indian from './components/Auth/South_indian';
import Footer from './components/Auth/Footer';
import Contact from './components/Auth/Contact';
import About from './components/Auth/About';
import OrderConfirmation from './components/Auth/OrderConfirmation';
import MyOrdersPage from './components/Auth/MyOrdersPage';
import FoodDetails from './components/Auth/FoodDetails';
import Dashboard from './components/Admin/Dashboard';
import AdminLogin from './components/Admin/AdminLogin';
import Bookings from './components/Admin/AllBookings';
import OrderManagement from './components/Admin/OrderManagement';
import AllUsers from './components/Admin/AllUser';
import AllBookings from './components/Admin/AllBookings';
import MyBookings from './components/Auth/MyBookings';
import AddFood from './components/Admin/AddFood';
import FoodManagement from './components/Admin/FoodManagement';
import EditFood from './components/Admin/EditFood';
import ReviewForm from './components/Auth/Review';
import ReviewsList from './components/Auth/AllReview';
import Profile from './components/Auth/MyProfile';
function App() {
  return (
    <div>
      <Router>
        <Navbarr />
        
        <Routes>
          
          {/* Home Pages */}
          <Route path='my-bookings' element={<MyBookings/>}></Route>
          <Route path="/admin/bookings" element={<AllBookings />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/' element={<Home />} />
          <Route path='/all-reviews' element={<ReviewsList/>}/>
          <Route path='/Contact' element={<Contact />} />
          <Route path='/About' element={<About />} />
          <Route path='/Bengali' element={<Bengali />} />
          <Route path='/Chinese' element={<Chinese />} />
          <Route path='/South' element={<South_indian />} />
          <Route path='/Login' element={<Login />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path='/Signup' element={<Signup />} />
          <Route path='/order-confirmation' element={<OrderConfirmation />} />
         <Route path='/admin/add-foods'element={<AddFood/>}/>
         <Route path='/review' element={<ReviewForm/>}/>
          <Route path='admin/all-foods' element={<FoodManagement/>}/>
          <Route path="/foods/:id" element={<FoodDetails />} />
          {/* Admin Routes */}
          <Route path="my-profile" element={<Profile/>}/>
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/all-orders" element={<OrderManagement />} />
          <Route path="/admin/foods/edit/:id" element={<EditFood />} />         
          <Route
            path="/admin/dashboard"
            element={
              localStorage.getItem('token') && localStorage.getItem('role') === 'admin'
                ? <Dashboard />
                : <Navigate to="/adminLogin" replace />
            }
          />
          <Route path="/adminLogin" element={<AdminLogin />} />
        
        <Route path="/admin/users" element={<AllUsers />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
