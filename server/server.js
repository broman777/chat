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
	var user = Date.now(), 
		service = {
			total: io.engine.clientsCount,
			service: true,
			id: user,
			text: 'connected'
		};
	io.emit('message', service);
	socket.on('message.sent', (message) =>{
		let msg = {
			id: user,
			text: message
		};
		io.emit('message', msg);
	});
	socket.on('disconnect', function(){
		service.text = 'disconnected';
		io.emit('message', service);
	});
});

http.listen(port, ()=> {
	console.log(`Server started on port ${port}...`);
});