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

socket.on('newLocationMessage', function(message) {
	if(message.from && message.url && message.createdAt) {
		var li = $('<li></li>');
		var a = $('<a target="_blank"></a>');

		a.text(`${message.from}'s Location(${message.createdAt})`);
		a.attr('href', message.url);
		li.css('list-style-type', 'none');
		li.append(a);
		$('#messages').append(li);
	}
});

var geolocationButton = $('#send-location');
if(!navigator.geolocation) {
	alert("Geolocation UNAVAILABLE in this browser!");
	geolocationButton.attr('disabled', 'true');
} else {
	geolocationButton.on('click', function(event) {
		geolocationButton.val("Sharing...");
		geolocationButton.attr("disabled", "true");
		navigator.geolocation.getCurrentPosition(function(pos) {
			socket.emit('createLocationMessage', {
				from: 'User',
				latitude: pos.coords.latitude,
				longitude: pos.coords.longitude
			}, (ackMsg) => {
				console.log(ackMsg);
				geolocationButton.removeAttr("disabled");
			});
		}, function() {
			alert('Unable to fetch the geolocation');
			geolocationButton.removeAttr("disabled");
		});
	});
}

$('#message-form').on('submit', function(event){
	event.preventDefault();

	var textInput = $(event.target).find('input');
	var textMsg = textInput.val();

	socket.emit('createMessage', {
		from: 'User',
		text: textMsg
	}, function(ack) {
		console.log(ack);
		textInput.val("");
	});
});