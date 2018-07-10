const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const publicPath = path.join(__dirname, '../web');
const port = process.env.PORT || 3000;

app.get('/', (request, response) => {
	response.sendFile(publicPath + '/index.html');
})

io.on('connection', function (socket) {
	var user = Date.now(), service;
	socket.on('message.sent', (message) =>{
		console.log(message, user);
		let msg = {
			type: 0,
			text: user + ': ' + message.text
		};
		io.emit('message', msg);
	});
	service = {
		type: 1,
		text: user + ' is connected'
	};
	io.emit('message', service);
});

http.listen(port, ()=> {
	console.log(`Server started on port ${port}...`);
});