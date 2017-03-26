require('./config');

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var salt_factor = 10;
var chalk = require('chalk');


var userSchema = new mongoose.Schema({
	username: {type:String,unique:true},
	email: {type:String,unique:true},
	password:{type:String}
});

userSchema.pre('save',function(next){
	var user = this;
	console.log('Before adding new user');
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(salt_factor,function(err,salt){
		if(err) return next(err);

		console.log(chalk.yellow('Salt Generated'))

		bcrypt.hash(user.password,salt,function(err,hash){
			if(err) return next(err);

			user.password = hash;
			next();
		});

	});
});

userSchema.methods.checkPassword = function(candidatePassword,cb) {
	bcrypt.compare(candidatePassword,this.password,function(err,isMatch) {
		if(err) return cb(err);
		cb(null,isMatch);
	});
};

mongoose.model('User',userSchema);

var storySchema = new mongoose.Schema({
	author: {type:String},
	title: {type: String,unique:true},
  	created_at:{type:Date,default:Date.now},
  	summary:{type:String},
  	content: {type: String},
  	imageLink:{type:String},
  	comments:[{body:String,commented_by:String,date:Date}],
  	slug:{type:String}
});

mongoose.model('Story',storySchema);
