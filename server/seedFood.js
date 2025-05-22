const mongoose = require('mongoose');
const Food = require('./models/Food');

mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME')
  .then(() => {
    console.log('MongoDB connected');
    return Food.insertMany([
      { name: 'Chicken Biryani', category: 'Bengali', price: 180, description: 'Spicy chicken biryani' },
      { name: 'Paneer Butter Masala', category: 'North Indian', price: 160, description: 'Creamy paneer curry' },
      { name: 'Veg Noodles', category: 'Chinese', price: 120, description: 'Vegetarian noodles' },
      { name: 'Masala Dosa', category: 'South Indian', price: 100, description: 'Crispy dosa with masala' }
    ]);
  })
  .then(() => {
    console.log('Sample foods inserted');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error seeding food data:', err);
  });
