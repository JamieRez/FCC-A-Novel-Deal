'use strict';
var path = process.cwd();
var user = require('../models/user.js');
var bookjs = require('../models/book.js');
var Book = bookjs.Book;
var bookSearch = require('../../config/bookSearch.js').searchBook;
var Trade = require('../models/trade.js').Trade;
var tradejs = require('../models/trade.js');
var firstName ='';
var curUserEmail = '';
var reqBooks = [];

module.exports = {init};
function init(app,passport){

	//Homepage
	app.get('/',function(req,res){
		if(req.user){ //Get FirstName
			curUserEmail = req.user.email;
			firstName = req.user.name.substring(0,req.user.name.indexOf(' '));
			reqBooks = req.user.reqBooks;
		}else{
			firstName ='';
			curUserEmail ='';
			reqBooks = [];
		}
		Book.find({} , function(err,booksArr){ //get Books and render
			Trade.find({resUserEmail : curUserEmail}, function(err,tradesArr){
				res.render('index.pug' , {username : firstName,
					 												booksArr : booksArr ,
																	userEmail : curUserEmail,
																	userReqBooks : reqBooks,
																	tradesArr : tradesArr
																	});
			});
		});
	});


	//add a book
	app.get('/add' , function(req,res){
		if(!req.user){
			res.redirect('/auth/google');
		}else{
			res.render('addBook.pug' , {username : firstName});
		}
	});
	app.post('/add' , function(req,res){
		bookSearch(req.body.bookTitle , function(bookArr){
			res.send(bookArr[0]);
		});
	});

	app.post('/submitBook' , function(req,res){
		var newBook = new Book({
			name : req.body.finBookTitle,
			image : req.body.bookSrc,
			userEmail : curUserEmail
		});
		newBook.save(function(){
			res.send();
		});
	});


	//delete all books
	app.get('/delete' , function(req,res){
		tradejs.deleter();
	});


	//User Profile Page
	app.get('/profile', function(req,res){
		if(!req.user){
			res.redirect('/auth/google');
		}else{
			Book.find({userEmail : req.user.email} , function(err, booksArr){
				Trade.find({resUserEmail : curUserEmail} , function(err, tradesArr){
					res.render('profile.pug' , {username : firstName ,
						 													booksArr : booksArr ,
																			tradesArr : tradesArr,
																		 });
				});
			});
		}
	});


	//Request Trade
	app.post('/sendTrade' , function(req,res){
		Book.findOne({name : req.body.reqUserBookTitle} , function(err,theBook){
			if(err) throw err;
			var newTrade = new Trade({
				reqUserEmail : req.body.reqEmail,
				resUserEmail : theBook.userEmail,
				reqUserBookChoice : req.body.reqUserBookTitle,
				reqUserBookThumb : req.body.reqUserBookThumb
			});
			Book.find({userEmail : req.body.reqEmail} , function(err,booksArr){
				newTrade.reqUserBookArr = booksArr;
				newTrade.save(function(){
					user.User.findOne({email : req.user.email} , function(err,theUser){
						theUser.reqBooks.push(req.body.reqUserBookTitle);
						theUser.save(function(){
							res.send(theBook.userEmail);
						});
					});
				});
			});
		});
	});



	//User auth
	app.get('/auth/google', passport.authenticate('google', { scope
		 : ['https://www.googleapis.com/auth/plus.me' ,
		  'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile']}
		));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback', passport.authenticate('google', {
				failureRedirect: '/failure'
		}), function(req,res){
				res.redirect('/');
		});
}
