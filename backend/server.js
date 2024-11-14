const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 5000;

// Mongoose URI
const MONGO_URI =
  "mongodb+srv://atay1109:austin95@characters.xev6s.mongodb.net/?retryWrites=true&w=majority&appName=Characters";
// Initial Route - Health
app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB database has been successfully connected"))
  .catch(() => console.error(`MongoDB came across an error:`, err));

app.use(cors());
app.use(express.json());

//Get All Heros
app.get("/api/heros", async (req, res) => {
  try {
    const heros = await Hero.find();
    res.json(heros);
  } catch (error) {
    res.status(500).send(`Error pulling heros data`);
  }
});

app.listen(PORT, () => {
  console.log(`App is listening to ${PORT}`);
});
