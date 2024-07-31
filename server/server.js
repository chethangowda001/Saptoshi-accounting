const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const bidsRoutes = require('./routes/bidsRoutes');
const participantsRoutes = require('./routes/participantsRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/SaptosiGCF';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch(err => console.log(err));

app.use('/bids', bidsRoutes);
app.use('/participants', participantsRoutes);
app.use('/payments', paymentsRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
