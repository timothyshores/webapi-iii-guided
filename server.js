const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// Configure global middleware
server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
server.use((req, res, next) => {
    req.team = 'Web 18';
    next();
})

// Configure route handlers
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res, next) => {
    res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team}</p>
    `);
});

module.exports = server;
