//1ST DRAFT
const mongoose = require('mongoose');

const User = new mongoose.Schema({
  pieces: [Piece],
  toys: [Toy],
  pets: Pet
});

const Piece = new mongoose.Schema({
  name: {type: String, required: true},
  quantity: {type: Number, min: 0, required: true},
});


const Toy = new mongoose.Schema({
  name: {type: String, required: true},
  quantity: {type: Number, min: 0, required: true},
});

const Pet = new mongoose.Schema({
  name: {type: String, required: true},
  level: {type: Number, min: 1, max: 5, required: true},
  growth: {type: Number, required: true},
});
