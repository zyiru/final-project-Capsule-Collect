//1ST DRAFT
const mongoose = require('mongoose');

const Piece = new mongoose.Schema({
  name: {type: String, required: true},
  quantity: {type: Number, required: true},
});

const Toy = new mongoose.Schema({
  name: {type: String, required: true},
  quantity: {type: Number, required: true},
});

const Pet = new mongoose.Schema({
  name: {type: String, required: true},
  level: {type: Number, min: 1, max: 5, required: true},
  growth: {type: Number, required: true},
});

const User = new mongoose.Schema({
	username: {type: String, required: true},
	hash: {type: String, required: true},
	coins: {type: Number, required: true},
  pieces: [Piece],
  toys: [Toy],
  pets: Pet
});

mongoose.model('User', User);
mongoose.model('Piece', Piece);
mongoose.model('Toy',Toy);

/***** from hw06 *****/
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/finalproject';
}
mongoose.connect(dbconf,{useNewUrlParser: true, useUnifiedTopology: true});
