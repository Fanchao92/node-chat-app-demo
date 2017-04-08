var socket = io();

socket.on('connect', function() {
	console.log(`connected to server. socket #: ${socket.id}`);
});

socket.on('disconnect', function() {
	console.log(`disconnected from server. socket #: ${socket.id}`);
});

socket.on('newMessage', function(message) {
	if(message.from && message.text && message.createdAt) {
		var formattedTime = moment(message.createdAt).format("YYYY-MM-DD ddd hh:mm:ss A");

		var template = $('#message-template').html();
		var html = Mustache.render(template, {
			text: message.text,
			from: message.from,
			createdAt: formattedTime
		});

		$('#messages').append(html);
	}
});

socket.on('newLocationMessage', function(message) {
	console.log(message);
	if(message.from && message.url && message.createdAt) {
		var formattedTime = moment(message.createdAt).format("YYYY-MM-DD ddd hh:mm:ss A");
		var template = $('#location-message-template').html();
		var html = Mustache.render(template, {
			url: message.url,
			from: message.from,
			createdAt: formattedTime
		});

		$('#messages').append(html);
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