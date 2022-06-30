const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-shop', 'root', 'm0lik1989', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;