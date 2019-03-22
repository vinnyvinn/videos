const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const Idea = require('./models/Idea');
const bodyParser = require('body-parser');
const methodOveride = require('method-override');
const passport = require('passport'); 
const db = require('./config/database');

mongoose.connect(db.mongoURI,{useNewUrlParser:true})
.then((console.log('MongoDB Connected...')))
.catch((e) => console.log(e));

const port = process.env.PORT || 3000;

//body-parser

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//static folders

app.use(express.static(path.join(__dirname,'public')));

app.use(methodOveride('_method'));

//Express Session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global Variables

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    
    next();
})
//Handlebars Middleware

app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

app.use((req,res,next) => {
req.name = 'Vinny vinny';

next();
})

app.get('/',(req,res) =>{
    const title = 'Welcome from abroad';
   res.render('index',{title})
})

app.get('/about',(req,res) =>{
   res.render('about');
})

//Load Routes
const idea = require('./routes/ideas');
const users = require('./routes/users');
//Use Routes

app.use('/ideas',idea);
app.use('/users',users);

//Passport Config
require('./config/passport')(passport);

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})