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

function removeTrade(reqUserEmail , resUserEmail , cb){
  Trade.findOne({reqUserEmail : reqUserEmail , resUserEmail : resUserEmail} , function(err,trade){
    trade.remove(function(){
      user.User.findOne({email : reqUserEmail}, function(err,theUser){
        theUser.reqBooks = [];
        theUser.save(function(){
          cb();
        });
      });
    });
  });
}


module.exports = {Trade , deleter , removeTrade};
