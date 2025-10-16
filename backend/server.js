const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:RtA0WXYBc6yBRUvA@cluster0.jsnvxmd.mongodb.net/test2';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB cluster'))
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route imports
const deliveryTeamRoutes = require('./routes/deliveryTeamRoutes');
const memberRoutes = require('./routes/memberRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const salaryRoutes = require('./routes/salaries');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/itemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const userRoutes = require('./routes/user');

const jobRoutes = require('./Routes/jobRoutes');
const ratingRoutes = require('./Routes/ratingRoutes');
const projectRoutes = require('./Routes/projectRoutes');
const transactionRoutes = require('./Routes/transactionRoutes');
const testDataRoutes = require('./Routes/testDataRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Mount routes
app.use('/api/admin', adminRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes)

app.use('/api/items', itemRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/test-data', testDataRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/delivery-team', deliveryTeamRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tracking', trackingRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));