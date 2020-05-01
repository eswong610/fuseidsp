$(function () {
        
    //var socket = io();
    var socket = io({transports: ['websocket'], upgrade: false});
    $('.msg-form').submit(function(e) {
      e.preventDefault(); // prevents page reloading
      console.log($('#m').val());
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });


    socket.on('chat message', function(msg){
        
        let fullmsg = `${socket.id}: ${msg}`
    $('#messages').append($('<li>').text(fullmsg));
    });

    socket.on('room-created', function(room) {
        $('.room-container').append(`<div>${room}</div><a href='/socket/${room}'>Join</a>`)
        

        // const roomElement = document.createElement('div');
        // roomElement.innerText = room
        // // const roomLink = document.createElement('a');
        // // roomLink.href=`/sockets/${room}`;
        // // roomLink.innerText('Join')
        // const roomContainer = document.getElementsByClassName('room-container');
        // roomContainer.append('roomElement');
        // roomContainer.append('roomLink');

        console.log('from socketon room created' + room )

    })
 
  });