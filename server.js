const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

app.use(express.json());

app.use(cors());

//connect mongoDB.
const dbDriver = process.env.MONGO_URL;

//connect ports.
const port = process.env.PORT || 50020;
mongoose
  .connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(port, () => {
      console.log(`Connection Successful`);
      console.log(`Server running at http://localhost:${port}`);
    });
  });

const productRoute = require("./routes/productRoute");
app.use("/", productRoute);
const couponRoute = require("./routes/couponRoute");
app.use("/", couponRoute);
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);
const pushNotificationRoute = require("./routes/pushNotificationRoute");
app.use("/", pushNotificationRoute);
