$(function () {
        
    //MESSAGES 
    var socket = io({transports: ['websocket'], upgrade: false});

    // const name = prompt('Enter your name')
    // $('#messages').append($('<li>').addClass("text-center").text(Date()))
    socket.emit('new-user', name)

    // $('#messages').append($('<li>').text(''))


    socket.on('chat message', function(data){

        let fullmsg = `${data.name}: ${data.message}`;
        // $('#messages').append($('<div>').addClass('user-pp-container d-flex'));
        // $('#messages').append($('<li>').addClass("other-chat-box").text(fullmsg));
        $('#messages').append([
          $('<div/>', {'class': 'user-pp-container d-flex justify-content-start flex-row' }).append([
            $('<img/>', {'src': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2468&q=80', 'class':'userpp'}),
            ($('<li>').addClass("other-chat-box").text(fullmsg))
          ])
        ])
        
        
      });


    $('.msg-form').submit(function(e) {
      e.preventDefault(); // prevents page reloading
    //   console.log($('#m').val());
      const message = ($('#m').val());
      let mymessage = `You: ${message}`
      // $('#messages').append($('<li>').addClass("user-chat-box").text(mymessage))

      $.post('/socket/savemsg', {content: message}, ()=>console.log('successfully posted'))
      $('#messages').append([
        $('<div/>', {'class': 'user-pp-container d-flex justify-content-start flex-row-reverse' }).append([
          $('<img/>', {'src': 'https://images.unsplash.com/photo-1554126807-6b10f6f6692a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80', 'class':'userpp'}),
          ($('<li>').addClass("user-chat-box").text(mymessage))
        ])
      ])

      // $('.user-chat-box').prepend('<img class="userpp" src="https://images.unsplash.com/photo-1467189741806-ee3dc79755eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80")" />')
      socket.emit('send chat message', message);
      $('#m').val('');
      
    });

    socket.on('user-connected',(name)=>{
        
        // $('#messages').append($('<li>').addClass("connection-message").text(`${name} is Online`))
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

    //prompts 
    socket.on('user-prompt', (data)=>{
      console.log('hello from socket.on' + data.prompt)
      $('#messages').append($('<li>').addClass("connection-message").text(`Prompt: ${data.prompt}`))
    })
    
    $('.suggestion-links').click(function() {
      let prompttext = $(this).text();
      console.log('clicked prompt');
      $('#messages').append($('<li>').addClass("connection-message").text(`Prompt: ${prompttext}`))
    })

    //Private chat attempt
    socket.emit('join', {username: 'emmy'})
 
  });