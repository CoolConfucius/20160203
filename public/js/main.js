'use strict'; 

$(document).ready(init); 

function init() {
  $('#add').click(addCharacter); 
  $('#collection').on('click', '.remove', removeCharacter)
}

function addCharacter() {
  console.log("addCharacter");
  var name = $('#name').text(); 
  var find = $(this).data('find'); 

  $.ajax({
    url: "/sw/add",
    method: "PUT",
    data: {
      name: name, find: find, addedAt: Date.now()
    }
  })
  .success(function(data) {
    location.replace('/users/profile');
  })
  .fail(function(err) {
    alert('Error. Check console.');
    console.error("Error:", err);
  });;
}

// function removeCharacter() {
//   var _id = $(this).data('_id'); 

//   $.ajax({
//     url: "/sw/remove",
//     method: "PUT",
//     data: {
//       _id: _id
//     }
//   })
//   .success(function(data) {
//     location.replace('/users/profile');
//   })
//   .fail(function(err) {
//     alert('Error. Check console.');
//     console.error("Error:", err);
//   });;
// }