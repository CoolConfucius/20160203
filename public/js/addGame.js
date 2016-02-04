'use strict'

$(document).ready(init);

function init(){
  $('#addGame').on('click', addGame);
}


function addGame(e){
  e.preventDefault();

  $.post('/games', {
    title: $('#title').val(),
    publisher: $('#publisher').val(),
    platform: $('#platform').val(),
    rating: $('#rating').val(),
    imageURL: $('#imageurl').val()
  })
  .success(function() {
    console.log('success');
    location.href = '/games/mine';
  })
  .fail(function(err) {    
    console.log('err:', err);
    location.href = '/games/mine';
  });
}

