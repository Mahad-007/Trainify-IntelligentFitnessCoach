const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/trainify';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
      /* eslint-disable no-console */
      console.log(`Server listening on port ${port}`);
      /* eslint-enable no-console */
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
