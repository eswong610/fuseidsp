$(function () {
        
    //MESSAGES 
    var socket = io({transports: ['websocket'], upgrade: false});

    const name = prompt('Enter your name')
    $('#messages').append($('<li>').text('You joined'))
    socket.emit('new-user', name)

    // $('#messages').append($('<li>').text(''))


    socket.on('chat message', function(data){

        let fullmsg = `${data.name}: ${data.message}`
        $('#messages').append($('<li>').text(fullmsg));
    });

    $('.msg-form').submit(function(e) {
      e.preventDefault(); // prevents page reloading
    //   console.log($('#m').val());
      const message = ($('#m').val());
      let mymessage = `You: ${message}`
      $('#messages').append($('<li>').text(mymessage))
      socket.emit('send chat message', message);
      $('#m').val('');
      
    });

    socket.on('user-connected',(name)=>{
        $('#messages').append($('<li>').text(`${name} connected`))
    })

    //ROOMS (DONT TOUCH )

    socket.on('room-created', function(room) {
        $('.room-container').append(`<div>${room}</div><a href='/socket/${room}'>Join</a>`)
        console.log('from socketon room created' + room )

    })
 
  });