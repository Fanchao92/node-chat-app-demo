var User = function(id, name, room) {
	//this = Object.create(User.prototype);  //If called as: new User(id, name, room);
	this.id = id;
	this.name = name;
	this.room = room;
};

var Users = function() {
	this.users = [];
};
Users.prototype.addUser = function(id, name, room) {
	var user = new User(id, name, room);

	this.users.push(user);
	return user;
};
Users.prototype.removeUser = function(id) {
	for(var idx = 0; idx < this.users.length; idx++) {
		if(id === this.users[ idx ].id) {
			return this.users.splice(idx, 1)[ 0 ];
		}
	}

	return null;
}
Users.prototype.getUser = function(id) {
	for(var idx = 0; idx < this.users.length; idx++) {
		if(id === this.users[ idx ].id) {
			return this.users[ idx ];
		}
	}

	return null;
}
Users.prototype.getUserList = function(room) {
	var usersInRoom = this.users.filter((user) => {
		return user.room === room;
	});
	var userNames = usersInRoom.map((user) => {
		return user.name;
	});

	return userNames;
}
Users.prototype.isDuplicate = function(name, room) {
	for(var idx = 0; idx < this.users.length; idx++) {
		if(this.users[ idx ].room===room && this.users[ idx ].name===name) {
			return true;
		}
	}

	return false;
}
Users.prototype.getRooms = function() {
	var rooms = {};

	this.users.forEach((user) => {
		if(!rooms[ user.room ]) {
			rooms[ user.room ] = "dummy data here";
		}
	});

	return Object.keys(rooms);
}

module.exports = {
	Users
};