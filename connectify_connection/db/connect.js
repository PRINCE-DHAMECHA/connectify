const Sequelize = require("sequelize");

const sequelize = new Sequelize("node", "root", process.env.DBPASSWORD, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
