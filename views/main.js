$(document).ready(function(){

  var finBookTitle = '';
  var finbookSrc = '';

  $('#addBookForm').submit(function(){
    $.post('/add', {bookTitle : $('#bookTitle').val()} , function(book){
      finBookTitle = book.title;
      finBookSrc = book.thumbnail;
      $('#bookImg').attr('src' , book.thumbnail).css('display' , 'block');
      $('#bookTitle').val('').attr('placeholder', '');
      $('#addBookBtn').css('display' , 'block');
    });
    return false;
  });

  $('#addBookBtn').click(function(){
    $.post('/submitBook' , {finBookTitle :finBookTitle , bookSrc : finBookSrc} , function(){
      window.location = '/';
    });
  });

  $('.bookObj').hover(function(){
    $(this).children('.tradeBtn').css('display' , 'inline');
    $(this).children('.acceptBtn').css('display' , 'inline');
  } , function(){
    $(this).children('.tradeBtn').css('display' , 'none');
    $(this).children('.acceptBtn').css('display' , 'none');
  });

  $('.tradeBtn').click(function(){
    bookChosenTitle = $(this).parent('.bookObj').children('.bookTitle').text();
    bookChosenImg = $(this).parent('.bookObj').children('.bookThumb').attr('src');
    var reqUsername = $('#usernamevar').text();
    var reqUserEmail = $('#useremailvar').text();
    $.post('/sendTrade' , {reqUserBookTitle : bookChosenTitle , reqUsername : reqUsername , reqEmail : reqUserEmail , reqUserBookThumb : bookChosenImg} , function(resUser){
      alert('Trade Sent to ' + resUser);
      window.location ='/';
    });
  });

  $('.tradeRequestAlert').click(function(){
    window.location = '/profile';
  });


  $('.declineBtn').click(function(){
    reqUserName = $(this).parent().children('#usernamevar').text();
    $.post('/decline' , {reqUserName : reqUserName} , function(){
      alert('Trade from ' + reqUserName + ' declined');
      window.location = '/profile';
    });
  });

  $('.acceptBtn').click(function(){
    reqUserName = $(this).parent().children('#usernamevar').text();
    resUserBookChoice = $(this).parent().children('.bookTitle').text();
    resUserBookThumb = $(this).parent().children('.bookThumb').attr('src');
    $.post('accept' , {reqUserName : reqUserName , resUserBookChoice : resUserBookChoice , resUserBookThumb: resUserBookThumb} , function(){
      alert('Trade from ' + reqUserName + ' accepted');
      window.location = '/profile';
    });
  });







});
