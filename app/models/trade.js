var mongoose = require('mongoose');
var user = require('./user.js');

var tradeSchema = mongoose.Schema ({
  reqUserEmail : String,
  resUserEmail : String,
  reqUserBookChoice : String,
  reqUserBookThumb : String,
  reqUserBookArr : Array,
  resUserBookChoice : String
});

var Trade = mongoose.model('Trade' , tradeSchema);

var deleter = function(){
 Trade.remove({} , function(err){
    if(err) throw err;
    user.User.find({}, function(err,users){
      if(err) throw err;
      users.forEach(function(theUser){
        theUser.reqBooks = [];
        theUser.save();
      });
    });
  });
}


module.exports = {Trade , deleter};
