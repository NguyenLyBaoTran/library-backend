const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Book = sequelize.define("Book", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
 title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: DataTypes.STRING,
  published_year: {
    type: DataTypes.INTEGER,
    validate: { isInt: true }
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Book;