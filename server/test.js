const mongoose = require('mongoose');
const Food = require('./models/Food'); // adjust path

mongoose.connect('your_mongo_uri_here')
  .then(async () => {
    const results = await Food.find({
      $or: [
        { name: { $regex: "Polao", $options: "i" } },
        { category: { $regex: "Polao", $options: "i" } }
      ]
    });
    console.log(results);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
