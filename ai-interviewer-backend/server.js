 const express = require('express');
 const cors = require('cors');
 const morgan = require('morgan');
 require('dotenv').config();

 const connectDB = require('./config/database');

 //connect to database
 connectDB();
 
 const app = express();
 const port = process.env.PORT || 5000;

 //middleware
 app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({ extended: true}));
 app.use(morgan('dev'));

 //basic error handling middleware
 app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
 });

//Routes
 app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the AI Interviwer API' });
 });

//User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

//Interview routes
const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/interviews', interviewRoutes);

//Start Server
app.listen(port, () => {
    console.log('Server is running on port: ${port}');
});