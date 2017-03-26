var mongoose = require('mongoose');
var chalk = require('chalk');


var connStr = 'mongodb://localhost/test'
//var connStr = 'mongodb://admin:Dknight!123@ds143000.mlab.com:43000/whatsyourstory';

mongoose.connect(connStr);

mongoose.connection.on('connected',function(){
	console.log(chalk.green('Connected to '+connStr));
});

mongoose.connection.on('error', function(err){
	console.log(chalk.red('Error while connecting '+connStr+' '+err));
});

mongoose.connection.on('disconnected',function(){
	console.log(chalk.red('disconnected from '+connStr));
});

