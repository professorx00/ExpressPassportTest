const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');


const app = express();
const PORT =  process.env.PORT || 5000;

//user db
const userdb = require('./config/keys').MongoURI;
mongoose.connect(userdb,{useNewUrlParser: true})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))


//ejs
app.use(expressLayouts);
app.set('view engine','ejs');

//BodyParser
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'Monty Moose',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

//global Vars
app.use((req, res, next)=> {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next();
})


//routes
app.use('/', require('./routes/index.js'))
app.use('/users', require('./routes/user.js'))

//eventlister
app.listen(PORT, console.log(`Server started on port ${PORT}`));