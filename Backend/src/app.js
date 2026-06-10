const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const userRoutes = require('./routes/user.routes');
const artRoutes = require('./routes/art.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/arts', artRoutes);

// Swagger Documentation Route at root (/)
app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerDocument));

// Global Error Handler
app.use(errorHandler);

module.exports = app;
