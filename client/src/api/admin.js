// src/api/admin.js
import API from './axios';

export const fetchAllBookings = () => API.get('/admin/bookings');
export const fetchAllOrders = () => API.get('/admin/orders');
export const fetchAllUsers = () => API.get('/admin/users');
