const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  name: { type: String, required: true },
  alignment: String,
  intellegence: Number,
  strength: Number,
  speed: Number,
  durability: Number,
  power: Number,
  combat: Number,
  total: Number,
});

const Hero = mongoose.model("Hero", heroSchema);

module.exports = Hero;
