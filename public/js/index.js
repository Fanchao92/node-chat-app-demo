var socket = io();

socket.on('connect', function() {
	console.log(`connected to server. socket #: ${socket.id}`);
});

socket.on('disconnect', function() {
	console.log(`disconnected from server. socket #: ${socket.id}`);
});

socket.on('newMessage', function(message) {
	if(message.from && message.text && message.createdAt) {
		var li = $('<li></li>');

		li.css('list-style-type', 'none');
		li.text(`${message.from}(${message.createdAt}): ${message.text}`);
		$('#messages').append(li);
	}
});

$('#message-form').on('submit', function(event){
	event.preventDefault();
	socket.emit('createMessage', {
		from: 'User',
		text: $(event.target).find('input').val()
	}, function(ack) {
		console.log(ack);
	});
});