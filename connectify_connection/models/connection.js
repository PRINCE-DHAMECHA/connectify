const Sequelize = require("sequelize");

const sequelize = require("../db/connect");

const Connection = sequelize.define("connection", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  person1: Sequelize.STRING,
  person2: Sequelize.STRING,
  relation: Sequelize.STRING,
  isVerified: Sequelize.BOOLEAN,
});

module.exports = Connection;
