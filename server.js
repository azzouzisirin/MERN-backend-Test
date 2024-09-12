const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const drawingsRoutes = require('./routes/drawings');
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const winston = require('winston');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {

})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
const server = http.createServer(app);
app.use(morgan('combined', { stream: winston.stream.write }));

// Use routes
app.use('/api', drawingsRoutes);
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
  
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
  }
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
winston.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
