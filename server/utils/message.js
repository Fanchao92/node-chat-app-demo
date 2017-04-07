const moment = require('moment');

var date = moment();

var generateMessage = function(from, text) {
	return {
		from,
		text,
		createdAt: date.format('YYYY-MM-DD ddd hh:mm:ss A')
	};
} 

var generateLocationMessage = function(from, lat, long) {
	return {
		from,
		url: `https://www.google.com/maps?q=${lat},${long}`,
		createdAt: date.format('YYYY-MM-DD ddd hh:mm:ss A')
	};
}

module.exports = {
	generateMessage,
	generateLocationMessage
};