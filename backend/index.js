require('dotenv').config(); // 🔥 MUST be first

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Database connection
const connectDB = require('./Models/db');

// Routes & middleware
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const ExpenseRouter = require('./Routes/ExpenseRouter');
const ensureAuthenticated = require('./Middlewares/Auth');

const app = express();

// 🔗 Connect to MongoDB
connectDB();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Health check
app.get('/ping', (req, res) => {
  res.send('PONG');
});

// Routes
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/expenses', ensureAuthenticated, ExpenseRouter);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
