require('./db');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const session = require('express-session');
const sessionOptions = {
  secret: 'secret cookie thang (store this elsewhere!)',
  resave: true,
  saveUninitialized: true
}
app.use(session(sessionOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

const Piece = mongoose.model('Piece');

app.get('/', (req, res) => {
	res.render('home',{piece:randPiece});
});

let randPiece={};
app.post('/', (req, res)=>{
	Piece.aggregate([{$sample:{size:1}}], (err, result)=>{
		Piece.update({name: result[0].name}, {$inc: {quantity: 1}});
	});
	randPiece = {p: result[0], msg: "You Got "};
	res.redirect('/');
});

app.get('/collection/pieces', (req,res) => {
	Piece.find({}, (err, result)=>{
		res.render('collection', {collection: result});
	})
});

app.listen(3000);

