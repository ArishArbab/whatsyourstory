var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/logout', function(req, res, next) {
  console.log("Logging  Out :"+req.session.username);
  var loggedOutUser=req.session.username;
  req.session.destroy();
  console.log("Logged Out :"+loggedOutUser);
  res.render('logout',{loggedOutUser:loggedOutUser});
});


router.post('/newUser', function(req, res, next) {
  var username=req.body.username;
  var email=req.body.email;
  var password=req.body.password;

  var newuser=new User();
  newuser.username=username;
  newuser.email=email;
  newuser.password=password;

  newuser.save(function(err,savedUser){
      if(err){
        console.log("User already exists with that username or email" +err);
        var message="A user already exists with that username or email";
        res.render("register",{errorMessage:message});
        return;
      }else{
        req.session.newuser=savedUser.username;
        res.render("new-user",{session:req.session});
      }
  });
});

router.post('/authenticate', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({email:email},function(err,user){
  	console.log("User "+user);
  	if(user==null){
  		console.log('User is null redirecting to login');
  		var message = 'Could not find any user with this email ID';
  		res.render('login',{errorMessage:message});
  		return;
  	}

  	user.checkPassword(password,function(err,isMatch){
  		if(isMatch && isMatch == true){
  			console.log('Authentication Successful');
  			req.session.username=user.username;
  			req.session.loggedIn=true;
  			res.render('new-story',{session:req.session});
  		}else {
  			console.log('Authentication Failed');
  			var message = 'Invalid password';
  			res.render('login',{errorMessage:message});
  			return;
  		}
  	});

  });
});

module.exports = router;
