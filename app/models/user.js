var mongoose = require('mongoose');

var userSchema = mongoose.Schema ({
  googleId : String,
  name : String,
  email : String,
  reqBooks : Array
});

var User = mongoose.model('User' , userSchema);

var deleter = function(){
  User.remove({} , function(err){
    if(err) throw err;
  });
}


module.exports = {User , deleter};
