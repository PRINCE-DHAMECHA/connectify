const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./db/connect.js");

const connectionRoutes = require("./routes/connectionRoutes.js");
const cors = require("cors");

const Product = require("./models/connection.js");
const sequelize = require("./db/connect.js");
const errorHandler = require("./middlewares/errorHandler.js");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use("/connection", connectionRoutes);
app.use(errorHandler);
const port = process.env.PORT || 5002;

const start = async () => {
  try {
    sequelize.sync().then(() => {
      app.listen(port, () => {
        console.log(`Connection service up and running on port ${port}...`);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

start();
