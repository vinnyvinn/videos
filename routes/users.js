const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
router.get('/login',(req,res) =>{
    res.render('users/login');
});

router.get('/register',(req,res) =>{
    res.render('users/register');
});

//Post Login Form

router.post('/login',(req,res,next) =>{
passport.authenticate('local',{
    successRedirect:'/ideas',
    failureRedirect:'/users/login',
    failureFlash:true
})(req,res,next);
})
router.post('/register',(req,res) =>{
   let errors = [];

   if(req.body.password != req.body.password2){
       errors.push({text:'password fields do not match.'});
   }
   if(req.body.password.lenght < 4){
       errors.push({text:'Password field must be atleast 4 characters long'});
   }
   if(errors.length > 0){
       res.render('users/register',{
           errors:errors,
           email:req.body.email,
           name:req.body.name

       })
   }
   else{
       User.findOne({email:req.body.email}).then((user) =>{
           if(user){
               req.flash('error_msg','Email already registered.');
               res.redirect('/users/login');
           }
           else{
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            });
         
            bcrypt.genSalt(10,(err,salt) =>{
                bcrypt.hash(newUser.password,salt,(err,hash) =>{
                    if(err) throw err;
                    newUser.password = hash;
     
                    newUser.save().then((savedUser) =>{
                        req.flash('success_msg','You are now registered and can log in.');
                        res.redirect('/users/login');
                    }).catch((e) => console.log(e));
                });
            });
           }
       })
      
   }
})

//Logout User
router.get('/logout',(req,res) =>{
req.logout();
req.flash('success_msg','You are logged out.');
res.redirect('/users/login');
});

module.exports=router;