const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./db/connect.js");

const userRouter = require("./routes/userRoutes.js");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.js");

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use("/user", userRouter);
app.use(errorHandler);
const port = process.env.PORT || 5001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`User service is up and running on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
