const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const validation = require('./utils/validation.js');
const {Users} = require('./utils/users.js');

const publicPath = path.join(__dirname, '..', 'public');
const portNum = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log(`New User connected at Unix Time: ${new Date().getTime()}. Socket #: ${socket.id}`);

	socket.on('join', (params, callback) => {
		if(validation.isRealString(params.name) && validation.isRealString(params.room)) {
			users.addUser(socket.id, params.name, params.room);
			socket.join(params.room);
			socket.emit('newMessage', generateMessage('administrator', 'Welcome to the chat room: '+params.room));
			socket.broadcast.to(params.room).emit('newMessage', generateMessage('administrator', `${params.name} joins our chat room.`));
			io.to(params.room).emit('updateUserList', users.getUserList(params.room));
			callback(null);
		} else {
			callback('Both Room Name And User Name should BE NON-EMPTY STRING!');
		}
	});

	socket.on('createMessage', (message, callback) => {
		if(message.from && message.text) {
			var user = users.getUser(socket.id);

			console.log(`newMessage from ${user.name}(Socket #: socket.id): ${message.text}`);
			io.to(user.room).emit('newMessage', generateMessage(message.from, message.text));
			callback('From Server: Text Message Acknowledged');
		} else {
			callback('From Server: Text Message Denied');
		}
	});

	socket.on('createLocationMessage', (message, callback) => {
		if(message.from && message.latitude && message.longitude) {
			var user = users.getUser(socket.id);

			console.log(`newMessage from ${user.name}(Socket #: socket.id): ${message.text}`);
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(message.from, message.latitude, message.longitude));
			callback('From Server: Geolocation Message Acknowledged');
		} else {
			callback('From Server: Geolocation Message Denied');
		}
	});

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);

		if(user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('administrator', `${user.name} just left the chat room.`));
			console.log(`User(${JSON.stringify(user)}) Disconnect at ${new Date().getTime()}. Socket #: ${socket.id}`);
		}
	});
});

server.listen(portNum, () => {
	console.log(`Server is up on port ${portNum}`);
	console.log(`Server Diretory Name: ${publicPath}`);
});