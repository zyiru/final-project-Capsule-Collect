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
            errors.push({msg:'Username already exists'});
            res.render('register', {errors});
            }else{
            const fs = require('fs');
            fs.readFile('init_file.json', 'utf8', (err,data)=>{
                if(!err){
                const d = JSON.parse(data);
								console.log(d);
                const newUser = new User({username:username, hash:password, coins:d.coins, pieces:d.pieces, toys:d.toys, pets:d.pets});
                console.log('new user ',newUser);

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


app.post('/home', ensureAuthenticated, (req, res)=>{
	if(req.user.coins < 10){
		req.flash('error', 'You do not have enough coins. Play a game to earn more.');
	}else{
    User.aggregate([{$match: {username:req.user.username}}, {"$unwind":"$pieces"},{$sample:{size:1}}], (err, result)=>{
        User.updateOne({username:req.user.username, "pieces.name":result[0].pieces.name}, {$inc: {"pieces.$.quantity": 1, "coins": -10}}, (err, r)=>{
            req.flash('msg',`You got a ${result[0].pieces.name} piece`);
            res.redirect('/home');
					});
		});
		}
});

app.get('/collection/pieces', ensureAuthenticated, (req,res) => {
    res.render('collection-pieces',{user: req.user});
});

app.post('/collection/pieces', ensureAuthenticated, (req, res)=>{
    const toy = req.body.name;
    User.updateOne({username:req.user.username, "pieces.name": toy, "toys.name":toy},{$inc: {"pieces.$.quantity":-5, "toys.$.quantity":1}}, (err, r)=>{});
});

app.get('/collection/toys', ensureAuthenticated, (req,res) => {
    res.render('collection-toys',{user: req.user});
});

app.post('/collection/toys', ensureAuthenticated, (req,res)=>{
  const toy = req.body.name;
  const growth = req.user.pets.growth;
  if(growth >= 90){
    User.updateOne({username:req.user.username, "toys.name":toy}, 
    {$inc: {"toys.$.quantity":-1, "pets.level":1}},
    {$set: {"pets.growth": 0}},(err,r)=>{
      if(err) {res.status(500).json({success:false});}
      else {res.json({success: true, result: r})}
    });
  }else{
    User.updateOne({username:req.user.username, "toys.name":toy},{$inc: {"toys.$.quantity":-1, "pets.growth" :10}}, (err,r)=>{
      if(err) {res.status(500).json({success:false});}
      else {res.json({success: true, result: r})}
    });
  }
});

app.get('/game', ensureAuthenticated, (req, res)=>{
  res.render('game', {user: req.user}); 
});

app.post('/game', ensureAuthenticated, (req,res)=>{
  User.updateOne({username:req.user.username}, {$inc: {"coins": 5}},(err,r)=>{
    //res.redirect('/game');
    if(err) {res.status(500).json({success:false});}
    else {res.json({success: true, result: r})}
  });
});

app.get('/yard', ensureAuthenticated, (req, res)=>{
  res.render('yard', {user:req.user});
});

app.get('/user', ensureAuthenticated, (req, res)=>{
  res.json(req.user);
});

app.listen(process.env.PORT || 3000);

