const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Book = sequelize.define("Book", {
  title: DataTypes.STRING,
  author: DataTypes.STRING,
  category: DataTypes.STRING,
  published_year: DataTypes.INTEGER,
  available: DataTypes.BOOLEAN
});

module.exports = Book;