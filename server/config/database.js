const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false
  }
);

sequelize.authenticate()
  .then(() => console.log('Connected to Database:', sequelize.config.host))
  .catch(err => console.log('Error:', err));

module.exports = sequelize;