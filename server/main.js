console.log("=================================");

// Creating WebSocket server
var WsServerWrapper = require('./WsServerWrapper');
var wsServer = new WsServerWrapper(4663);
console.log("- WebSocket Server ready");
console.log("---------------------------------");


function tick() {
	for (var i = 0; i < wsServer.clients.length; i++) {
		wsServer.clients[i].tick();
	}

	setTimeout(tick, wsServer.clients.length > 0 ? 100 : 1000);
}

tick();