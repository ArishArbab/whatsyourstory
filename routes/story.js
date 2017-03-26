var express = require('express');
var mongoose = require('mongoose');
var story = mongoose.model('Story');
var chalk = require('chalk');
var router = express.Router();


router.get('/', function(req, res, next) {
	story.find({},function(err,stories){
		res.render('home',{stories:stories,session:req.session});
	});
});

router.get('/new-story', function(req, res, next) {
  if(req.session.loggedIn !== true){
        res.redirect('/users/login');
    }else{
        res.render('new-story',{session:req.session});
    }
});

router.post('/:slug/saveComment', function(req, res, next) {
  var story_slug=req.params.slug;
  var comment=req.body.comment;
  var posted_date=new Date();

  console.log(story_slug);
  story.findOne({slug:story_slug}, function(err,story){
    story.comments.push({body:comment,commented_by:req.session.username,date:posted_date});
    story.save(function(err,savedStory){
      if(err){
        console.log("Error : While saving comments");
        return res.status(500).send();
      }else{
        res.render('story',{story:story,session:req.session});
      }
    });

  });
});

router.post('/add-story', function(req, res, next) {
    var title=req.body.title;
    var content=req.body.content;
    var summary=req.body.summary;
    var imageLink=req.body.imageLink;
    var author =req.session.username;
    console.log("Author is :"+author);
  
    var newStory = new story();
    newStory.author=author;
    newStory.title=title;
    newStory.content=content;
    newStory.summary=summary;
    newStory.imageLink=imageLink;

    var lowercaseTitle=newStory.title.toLowerCase();
    var slug=lowercaseTitle.replace(/[^a-zA-Z0-9 ]/g, "");
    var hyphenAddedTitle=slug.replace(/\s+/g, '-');

    newStory.slug=hyphenAddedTitle;

    newStory.save(function(err,story){
      if(err){
        console.log('Error while saving the story');
        return res.status(500).send();
      }else{
        res.redirect('/stories');
      }
    });

});

router.get('/:story', function(req, res, next) {
	var url=req.params.story;
   	story.findOne({slug:url}, function(err,story){
           res.render('story',{story:story,session:req.session});
    });
});




module.exports = router;
