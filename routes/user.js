const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//Login Page
router.get('/login', (req, res) => { res.render("login") })

//Register Page
router.get('/register', (req, res) => { res.render("register") })

// Register Handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please Enter All Fields" });
  }
  //check if passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords Do Not Match" });
  }

  // check password is length
  if (password.length < 6) {
    errors.push({ msg: "Passwords should be at least 6 characters" });
  }
  console.log(errors.length)
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    //validation Passed
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          errors.push({ msg: "Email is already registered." })
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
          // console.log(newUser);
          // res.send('hello');
          //Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              //set password to hash
              newUser.password = hash
              // set new user
              newUser.save()
                .then(user => {
                  req.flash('success_msg', "You are now registered and can login.")
                  res.redirect('/users/login')
                })
                .catch(err => console.log(err))
            })
          })
        }
      });
    }
  });

  module.exports = router