
window.roomName = "lobby"
window.rooms = {};
window.friends = {};

$(document).ready(function () {
    function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
    
    function filter_iframe(iframe_tag){
            // if iframe have youtube in it - return it back unchanged
            if(/src=".+youtube/.test(iframe_tag)){ return iframe_tag }
            // if not - replace it with empty string, effectively removing it
            return ''
        }

  };



var load = function () {
  
  room = window.roomName  

  var i;
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      //console.log('chatterbox: Message sent. Data: ', data.results);
      window.rooms = {};
      
      for (var i = 0; i < data.results.length; i++ ) {
        if (!rooms[data.results[i].roomname]) {
          
          var cleanRoomName = escapeHtml( data.results[i].roomname )
          cleanRoomName = DOMPurify.sanitize(cleanRoomName);
          
          if (cleanRoomName.length < 30) {
            rooms[cleanRoomName] = [];
          }
        }
          var cleanRoomName = escapeHtml( data.results[i].roomname )
          cleanRoomName = DOMPurify.sanitize(cleanRoomName);
          if (cleanRoomName.length < 30) {
            rooms[cleanRoomName].push(data.results[i])
          }
          
      }
      

      for (i = 0; i < rooms[roomName].length; i++) {
        var username = rooms[roomName][i].username;
        var message = escapeHtml( rooms[roomName][i].text )
        message = DOMPurify.sanitize(message);
        
        message.replace('/<iframe.*?>/', '');
        if (window.friends[username]) {
          var $message = "<li><span class='username friend'>"+username+"</span><span class='text'>"+message+"</span></li>";
        } else {
          var $message = "<li><span class='username'>"+username+"</span><span class='text'>"+message+"</span></li>";          
        }
        $("#messageList").append($message)
      }
      updateRoomSelect()
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message. Error: ', data);
    }
  });

}

load();

setInterval(function () {
  // delete messages
  $("#messageList").children().remove();
  // Load messages
  load();
}, 3000);
  
  $( "#submitmessage" ).on( "submit", function(e) {
    e.preventDefault();
    
    var inputValue = $("input").val()
    
    var message = {
      username: window.location.search.slice(10),
      text: inputValue,
      roomname: $('select').val()
    };
   
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent. Data: ', data);
        $('input').val("")
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    });
    
  });

  var updateRoomSelect = function () {
    var i;
    var roomOptions = Object.keys(rooms);
    $('select').children().remove();
    console.log(window.roomName)
    for (i = 0; i < roomOptions.length; i++) {
      var option = "<option value='" + roomOptions[i] + "'>" + roomOptions[i] + "</option>"; 
      $('select').append(option);
    }
    $('select').val(window.roomName);
  };

  var selectRoom = function (name) {
    window.roomName = name;
   
  };

  // var addToFriends () {
  //   $(this).val()
  // }

  $('#messageList').on('click', 'span.username', function (){
    console.log( $(this).text() );
    window.friends[$(this).text()] = true;

  })

  $("select").change(function(){
    if ( $(this).children(":selected").val() !== "add room") {
      selectRoom($(this).children(":selected").val());
    }
  });

  // add A chat room

})
