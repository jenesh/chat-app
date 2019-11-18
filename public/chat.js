const socket = io(`http://localhost:3000`)

$('form').submit((e) => {
    e.preventDefault();
    const msg = $('#msg').val();
    console.log(msg)

    socket.emit('message', {
        message: msg
    })

    return false;
})

let stillTyping = true;

$('#msg').keyup((e) => {
    const msg = e.target.value;
    if (msg.length === 0) {
        stillTyping = true;
        socket.emit('typing', {
            userId: socket.id,
            typing: false
        })
        return;
    } 
    if (stillTyping) {
        socket.emit('typing', {
            userId: socket.id,
            typing: true
        })
        stillTyping = false;
    }
})

socket.on('message', (data) => {
    console.log(data)
    $('#messages').append($('<li>').text(data.message));
})

socket.on('typing', (data) => {
    console.log(data)
    if (data.typing) {
        $('#typing').text(`${data.userId} is typing...`);
    } else {
        $('#typing').text('');
    }
})