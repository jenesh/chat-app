const socket = io(`http://localhost:3000`)

$('#form-chat').submit((e) => {
    e.preventDefault();
    const message = $('#msg').val();
    const name = $('#name').text();
    
    socket.emit('message', { message, name })
    $('#messages').append($('<li>').text(`${name}: ${message}`).addClass('user'));
    $('#msg').val('');
})

let isTyping = false;
let typingMsgSent = false;

$('#msg').keyup((e) => {
    const msg = e.target.value;
    const name = $('#name').text();
    // Emit to server that the user is typing
    if (msg.length > 0) {
        isTyping = true;
        if (isTyping && !typingMsgSent) {
            socket.emit('typing', {
                name: name,
                typing: true
            })
            typingMsgSent = true;
            return;
        }
    }
    // Emit to server that the user stopped typing
    if (msg.length === 0 && typingMsgSent) {
        isTyping = false;
        typingMsgSent = false;
        socket.emit('typing', {
            name: name,
            typing: false
        })
        return;
    }
})

socket.on('message', (data) => {
    $('#messages').append($('<li>').text(`${data.name}: ${data.message}`).addClass(data.name));
})

socket.on('typing', (data) => {
    if (data.typing) {
        $('#typing').text(`${data.name} is typing...`);
    } else {
        $('#typing').text('');
    }
})

socket.on('connected', (data) => {
    $('#messages').append($('<li>').text(`${data.name} is now online`).addClass('connected'));
})

$('#form-nickname').submit((e) => {
    e.preventDefault();
    const nickname = $('#nickname').val();

    $('#name').text(nickname);
    $('#popUp').remove();
    socket.emit('connected', {name: nickname})
})

socket.on('disconnected', (data) => {
    $('#messages').append($('<li>').text(`${data.name} is now offline`).addClass('disconnected'));
})