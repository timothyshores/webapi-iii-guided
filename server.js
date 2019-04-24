const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

const greeter = teamName => {
    return (req, res, next) => {
        req.team = teamName;
        next();
    };
}

const seconds404 = (req, res, next) => {
    const seconds = new Date().getSeconds();
    seconds % 3 === 0
        ? res.status(404).send(`${seconds} is divisible by 3`)
        : next()
}

const restricted = (req, res, next) => {
    const password = req.headers.password;
    password === 'admin' ? next() : res.status(401).send('Incorrect password');
}

const only = user => {
    return (req, res, next) => {
        user !== req.headers.user
            ? res.status(403).send('Incorrect username')
            : next();
    }
}

// Configure global middleware
server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
server.use(greeter('Lambda School Web 18'));
// server.use(seconds404); //disabled seconds404

// Configure route handlers
server.use('/api/hubs', restricted, only('admin'), hubsRouter);

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team}</p>
    `);
});

module.exports = server;
