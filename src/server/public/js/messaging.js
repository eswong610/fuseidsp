$(function () {
        
    //MESSAGES 
    var socket = io({transports: ['websocket'], upgrade: false});

    // const name = prompt('Enter your name')
    $('#messages').append($('<li>').addClass("text-center").text(Date()))
    socket.emit('new-user', name)

    // $('#messages').append($('<li>').text(''))


    socket.on('chat message', function(data){

        let fullmsg = `${data.name}: ${data.message}`;
        $('#messages').append($('<li>').addClass("other-chat-box").text(fullmsg));
    });


    $('.msg-form').submit(function(e) {
      e.preventDefault(); // prevents page reloading
    //   console.log($('#m').val());
      const message = ($('#m').val());
      let mymessage = `You: ${message}`
      $('#messages').append($('<li>').addClass("user-chat-box").text(mymessage))
      
      
      socket.emit('send chat message', message);
      $('#m').val('');
      
    });

    socket.on('user-connected',(name)=>{
        
        $('#messages').append($('<li>').addClass("connection-message").text(`${name} connected`))
    })

    //ROOMS (DONT TOUCH )

    socket.on('room-created', function(room) {
        $('.room-container').append(`<div>${room}</div><a href='/socket/${room}'>Join</a>`)
        console.log('from socketon room created' + room )

    })


    $('.suggestion-links').click(function (){
      const promptText = $(this).children().text()      
      socket.emit('use-prompt', promptText);
      
    })

    socket.on('user-prompt', (data)=>{
      console.log('hello from socket.on' + data.prompt)
      $('#messages').append($('<li>').addClass("connection-message").text(`Prompt: ${data.prompt}`))
    })
    
 
  });