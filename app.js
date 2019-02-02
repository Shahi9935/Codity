const express = require('express');
const bodyParser= require('body-parser');
const path = require('path');
const mongoose=  require('mongoose');
const expressValidator= require('express-validator');
const flash=  require('connect-flash');
const session= require('express-session');
const config= require('./config/database');
const passport= require('passport');
const bcrypt= require('bcryptjs');
const port= process.env.PORT || 3000;

mongoose.connect('mongodb://admin:Admin1234@ds111765.mlab.com:11765/codity',{ useNewUrlParser: true });
let db=mongoose.connection;

db.once('open',()=>{
console.log('Connect to Database');
});

db.on('error',(err)=>{
	console.log(err);
});

const app=express();

app.use(bodyParser.urlencoded({extended:false,limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));

app.use(express.static('views'));
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

app.use(expressValidator())

app.use(require('connect-flash')());
app.use(function (req, res, next) {
res.locals.messages = require('express-messages')(req, res);
next();
});

let User= require('./models/user');
let Todo= require('./models/todo');

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*',(req,res,next)=>{
    res.locals.user= req.user || null;
    next();
    });

app.get("/",(req,res)=>{
    res.render('index');
});

app.get("/login",(req,res)=>{
    if(req.user){
        req.flash('warning','Log out from your session to Log in');
        res.redirect('/user/'+req.user.username);
    }else{
    res.render('login');
    }
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.get('/user/:userName', function(req, res, next) {
    User.findOne({username:req.params.userName},(err,userFound)=>{
        if(userFound){
                res.render('profile',{
                    userprofile:userFound,
                    user:req.user,
                        });
        }else{
            //Send 404 page
            req.flash('danger','User not found');
            res.redirect('/login');
        }
        });
});

app.get('/todo/:userName', function(req, res, next) {
    if(req.user){
    Todo.findOne({username:req.params.userName},(err,userFound)=>{
        if(userFound){
                res.render('todo',{
                    userprofile:userFound,
                    user:req.user
                        });
        }else{
            req.flash('danger','User not found');
            res.redirect('/login');
            //Send 404 page
        }
        });
    }else{
        req.flash('danger','Log in first');
        res.redirect('/login');
    }
});

app.get('/submissions/:userName', function(req, res, next) {
    User.findOne({username:req.params.userName},(err,userFound)=>{
        if(userFound){
                res.render('submissions',{
                    userprofile:userFound,
                    user:req.user,
                        });
        }else{
            //Send 404 page
            req.flash('danger','User not found');
            res.redirect('/login');
        }
        });
});

app.get("/coding-calendar",(Req,res)=>{
    res.render('coding-calendar');
});

app.get("/search-problems",(Req,res)=>{
    res.render('search-problems');
});

app.get('/logout',(req,res)=>{
    if(req.user){
    req.logout();
    req.flash('warning','Logged out successfully');
    res.redirect('/login');
    }else{
    req.flash('success','Log in to Log out');
    res.redirect('/login');
    }
    });





app.post('/register',(req,res)=>{
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('username','Userame is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);
    let errors = req.validationErrors();
    if(errors){
            
            for(var i=0;i<errors.length;i++){
                req.flash('danger',errors[i].msg);
            }
            res.locals.user = req.user || null;
            res.render('register');
            return;
        }
    User.findOne({ username: req.body.username }, function(errr, userexists) {
          if (errr) { return done(errr); }
          if (userexists) {
                  req.flash('danger','Username exists');
                  res.redirect('register');
              }
    
          });
        let newUser= User({
            name:req.body.name,
            email:req.body.email,
            username:req.body.username,
            password:req.body.password,
            spojhandle:req.body.spojhandle,
            codechefhandle:req.body.codechefhandle,
            codeforceshandle:req.body.codeforceshandle
        });
        let newTodo = Todo({
            username:req.body.username,
            todo:[]
        });
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err){
                    console.log(err);
                    req.flash('danger','Some error occured. Try again');
                    res.redirect('/');
                }
                newUser.password=hash
                    newUser.save((err)=>{
                        if(err){
                        console.log(err);
                        return;
                        }
                newTodo.save((err)=>{
                        if(err){
                        console.log(err);
                        return;
                    }
                });
                req.flash('success','User registered successfully');
                res.redirect('/login');
    });
            });
        });
    });

app.post('/login',(req,res,next)=>{
    res.locals.user = req.user || null;
	passport.authenticate('local',{
		successRedirect:'/user/'+req.body.username,
		failureRedirect:'/login',
		failureFlash:true
	})(req,res,next);
});

app.post('/todo/:username',(req,res,next)=>{
	if(req.user.username == req.params.username){
        req.checkBody('todoproblems','Atleast one Todo Problem is required').notEmpty();
        let errors = req.validationErrors();
    if(errors){
            
            for(var i=0;i<errors.length;i++){
                req.flash('danger',errors[i].msg);
            }
            res.redirect('/todo/'+req.params.username);
            return;
        }
    let temparr = req.body.todoproblems.split(/\r?\n/);
    Todo.findOne({ username: req.user.username }, function(errr, todofound) {
        if (todofound) {
            let temp = todofound.todo;
            temp = temp.concat(temparr);
            let todonew = {};
            todonew.todo = temp;
            Todo.updateOne({username:req.user.username},todonew,(err)=>{
                if(err){
                    console.log(err);
                    req.flash('danger','There was some rror. Please try again.');
                    res.redirect('/todo/'+req.user.username);
                    return;
                }
            req.flash('info','Todo problems added');
             res.redirect('/todo/'+req.user.username);
        });
        }else{
        res.redirect('/todo/'+req.params.username);
        }
    });
    }else{
        req.flash('danger',"Don't try to add todo's for others");
        res.redirect('/login');
    }
});


app.listen(port,()=>{
    console.log("Server Started");
});