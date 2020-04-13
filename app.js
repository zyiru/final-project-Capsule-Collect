require('./db');

const passport = require('passport');
require('./passport')(passport);

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');

const app = express();

//express session
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    saveUninitialized: true
}
app.use(session(sessionOptions));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

hbs.registerPartials(path.join(__dirname,'/views/partials'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

const Piece = mongoose.model('Piece');
const Toy = mongoose.model('Toy');
const User = mongoose.model('User');

app.use((req, res, next)=>{
				res.locals.error = req.session.errors;
				next();
				});

//const username;

//register and login
app.get('/', (req, res) => {
    res.render('welcome');
});

app.get('/register',(req,res)=>{
    res.render('register');
});
app.post('/register',(req,res)=>{
    console.log(req.body);
    const { username, password, password2 } = req.body;
    let errors = [];
    
    //check for errors
    if(!username || !password || !password2){
	errors.push({msg: 'Please fill in all fields'});
    }
    if(password !== password2){
	errors.push({msg: 'Passwords do not match'});
    }
    if(password.length < 6){
	errors.push({msg: 'Password should be at least 6 characters'});
    }
    
    console.log(errors);
    
    if(errors.length > 0){
	res.render('register', {errors});
    }else{
	//valid
	User.findOne({username:username})
	    .then(user => {
		if(user){
		    console.log(user);
		    errors.push({msg:'Username already exists'});
		    res.render('register', {errors});
		}else{
				const fs = require('fs');
		    fs.readFile('init_file.json', 'utf8', (err,data)=>{
			if(!err){
			    const d = JSON.parse(data);
			    console.log('parsed data', d);
			    const newUser = new User({username:username, hash:password, coins:d.coins, pieces:d.pieces, toys:d.toys, pets:d.pets});
			    console.log('new user ',newUser);
			    /*** hash password ***/
			    
			    //save new user
			    newUser.save()
				.then(user => res.redirect('/login'))
				.catch(err => console.log(err));
			}
		    });
		}
	    });
    }
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login',(req, res, next)=>{
	passport.authenticate('local',{
		successRedirect: '/home',
		failureRedirect: '/login'
	})(req, res, next);
});

//after loging in
app.get('/home', (req, res) => {
    console.log(randPiece);
    res.render('home',{msg});
});


let randPiece={};
let msg;
app.post('/home', (req, res)=>{
    User.aggregate([{$match: {username:username}}, {"$unwind":"$pieces"},{$sample:{size:1}}], (err, result)=>{
	User.updateOne({username:username, "pieces.name":result[0].pieces.name}, {$inc: {"pieces.$.quantity": 1}}, (err, r)=>{
	    randPiece = result[0];
	    msg = `You got a ${result[0].pieces.name} piece`;
	});
    });
    /*
      Piece.aggregate([{$sample:{size:1}}], (err, result)=>{
      Piece.update({name: result[0].name}, {$inc: {quantity: 1}}, (err, r)=>{
      console.log(r);
      });
      randPiece = result[0];
      msg = 'You got a '+result[0].name+' piece';
      });*/
    res.redirect('/home');
});

/*
  app.post('/',(req,res)=>{
  Piece.aggregate([{$sample:{size:1}}], (err, result)=>{
  Piece.update({name: result[0].name}, {$inc: {quantity: 1}});
  console.log(result[0]);
  });
  });
*/
app.get('/collection/pieces', (req,res) => {
    User.find({username:username},(err, result)=>{
	if(result.length ===0 || err){
	    res.send('User not found');
	}else{
	    const pieces = result[0].pieces;
	    console.log(pieces);
	    res.render('collection',{collection: pieces});
	}
    });
});
/*
  Piece.find({}, (err, result)=>{
  res.render('collection', {collection: result});
  })
  });

  app.get('/collection/pieces', (req,res) => {
  Toy.find({}, (err, result)=>{
  res.render('collection', {collection: result});
  })
  });*/

app.get('/collection/pieces', (req,res) => {
    User.find({username:username},(err, result)=>{
	if(result.length ===0 || err){
	    res.send('User not found');
	}else{
	    console.log(err);
	    const toys = result[0].toys;
	    console.log(toys);
	    res.render('collection',{collection: toys});
	}
    });
});

app.listen(3000);

