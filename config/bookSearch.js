var books = require('google-books-search');

function searchBook(title,cb){

  books.search(title , function(err, bookArr){
    if(err) throw err;
    cb(bookArr);
  });

}

module.exports = {searchBook};
