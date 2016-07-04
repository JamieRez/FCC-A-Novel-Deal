var mongoose = require('mongoose');

var bookSchema = mongoose.Schema ({
  name : String,
  image : String,
  userEmail : String,
  tradeEmails : {type : Array , default : []}
});

var Book = mongoose.model('Book' , bookSchema);

var deleter = function(){
  Book.remove({} , function(err){
    if(err) throw err;
  });
}


module.exports = {Book , deleter};
