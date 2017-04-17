var roomList = $('.form-field datalist#rooms');
$.getJSON('/rooms', (rooms) => {
	rooms.forEach((room) => {
		roomList.append(`<option value="${room}">`);
	});
	console.log(rooms);
}).fail(() => {
	roomList.remove();
});