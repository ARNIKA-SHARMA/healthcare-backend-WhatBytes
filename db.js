const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('healthcare', 'postgres', 'Arnik@00', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5433
});

async function connectToPostgres() {
    try {
        await sequelize.authenticate();
        console.log("Connected to PostgreSQL Successfully");
    } catch (err) {
        console.error("Unable to connect to the database:", err);
    }
}

module.exports = { sequelize, connectToPostgres }; 



