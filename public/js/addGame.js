'use strict'

$(document).ready(init);

function init(){
  $('#addGame').on('click', addGame);
}


function addGame(){
  $.post('/games', {
    title: $('#title').val(),
    publisher: $('#publisher').val(),
    rating: $('#rating').val(),
    imageURL: $('#imageurl').val()
  })
  .success(function() {
    console.log('success');
    location.href = '/games/mine';
  })
  .fail(function(err) {
    //alert('Error.  Check console.');
    console.log('ERROR');
    console.log('err:', err);
  });
}

