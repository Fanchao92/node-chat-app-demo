var socket = io();

socket.on('connect', function() {
	console.log(`connected to server. socket #: ${socket.id}`);

	socket.on('newMessage', function(message) {
		if(message.from && message.text && message.createdAt) {
			console.log(message);
		}
	});
});
socket.on('disconnect', function() {
	console.log(`disconnected from server. socket #: ${socket.id}`);
});