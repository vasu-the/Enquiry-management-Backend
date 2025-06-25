const mongoose = require("mongoose")
require("dotenv").config();
mongoose.set("strictQuery", false)

mongoose.connect(process.env.MONGODBURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
     serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds if no DB server found
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  }).then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((err) => {
    console.log(err, "Error")
  });
  