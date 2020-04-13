require('./db');

const passport = require('passport');
require('./config/passport')(passport);

const {ensureAuthenticated} = require('./config/auth');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');
const flash = require('connect-flash');

const app = express();

//express session
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    saveUninitialized: true
}
app.use(session(sessionOptions));

//connect flash
app.use(flash());

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

//global variables
app.use((req, res, next)=>{
				res.locals.msg = req.flash('msg');
				res.locals.error = req.flash('error');
				next();
				});

const User = mongoose.model('User');


//register and login
app.get('/', (req, res) => {
    res.render('welcome');
});

app.get('/register',(req,res)=>{
    res.render('register');
});
app.post('/register',(req,res)=>{
    console.log(req.body);
				 
		// checking for and displaying errors when registering based off of:
		// https://github.com/bradtraversy/node_passport_login
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
    
    if(errors.length > 0){
	res.render('register', {errors});
    }else{
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
						.then(user => {
							req.flash('msg', 'You have successfully registered');
							res.redirect('/login')
						})
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
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);
});

//after loging in
app.get('/home', ensureAuthenticated, (req, res) => {
		res.render('home',{user:req.user});
});


app.post('/home', (req, res)=>{
    User.aggregate([{$match: {username:req.user.username}}, {"$unwind":"$pieces"},{$sample:{size:1}}], (err, result)=>{
	User.updateOne({username:req.user.username, "pieces.name":result[0].pieces.name}, {$inc: {"pieces.$.quantity": 1}}, (err, r)=>{
								 req.flash('msg',`You got a ${result[0].pieces.name} piece`);
								 res.redirect('/home');
	});
    });
});

app.get('/collection/pieces', ensureAuthenticated, (req,res) => {
	    res.render('collection-pieces',{user: req.user});
});

app.get('/collection/toys', ensureAuthenticated, (req,res) => {
	    res.render('collection-toys',{user: req.user});
});

app.listen(3000);

