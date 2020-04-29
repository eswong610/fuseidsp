$(function () {
        
    //var socket = io();
    var socket = io({transports: ['websocket'], upgrade: false});
    $('form').submit(function(e) {
      e.preventDefault(); // prevents page reloading
      console.log($('#m').val());
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
       socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
  });