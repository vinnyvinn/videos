const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');
const {ensureAuthenticated} = require('../helpers/auth');


router.get('/',ensureAuthenticated,(req,res) =>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then((ideas) =>{
        res.render('ideas/index',{ideas:ideas});
    })
})

router.get('/add', ensureAuthenticated,(req,res)=>{
    res.render('ideas/add');
})

router.get('/edit/:id',ensureAuthenticated,(req,res) =>{
    Idea.findOne({_id:req.params.id}).then((idea) =>{
        if(idea.user != req.user.id){
            req.flash('error_msg','Not Authorized.');
            res.redirect('/ideas');
        }
        else{
            res.render('ideas/edit',{idea:idea})
        }
        
    })
})
router.post('/',(req,res)=>{
 const idea = new Idea({
title:req.body.title,
details:req.body.details,
user:req.user.id
 });

 let errors = [];
 if(!req.body.title){
     errors.push({text:'Please add title'});
 }
 if(!req.body.details){
     errors.push({text:'Please add details'});
 }

 if(errors.length > 0){
     res.render('ideas/add',{
         errors:errors,
         title:req.body.title,
         details:req.body.details
     })
 }
else{
    idea.save().then((savedIdea) => {
        req.flash('success_msg','Video Idea added.');
        res.redirect('/ideas');
   }).catch((e) => console.log(e));   
}
});

router.put('/:id',(req,res) =>{
   
    Idea.findOne({_id:req.params.id}).then((idea) =>{
        idea.title=req.body.title;
        idea.details = req.body.details;
       
        idea.save().then((updatedIdea) =>{
            req.flash('success_msg','Video Idea updated.');
            res.redirect('/ideas');
        });

    });
});

router.delete('/:id',(req,res) =>{
  Idea.findOneAndDelete({_id:req.params.id}).then((idea) =>{
      req.flash('success_msg','Video Idea removed.'); 
      res.redirect('/ideas');
  })
});


module.exports = router;