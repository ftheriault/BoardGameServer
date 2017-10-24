var WebSocketServer = require('ws').Server;
var WsClient = require("./board/BoardClient");

module.exports = WsServerWrapper = function (wsPort) {
	this.wss = new WebSocketServer({ port: wsPort });
	this.clients = [];
	var wsServer = this;

	this.wss.on('connection', function connection(ws) {
		var boardClient = new BoardClient(ws);
		
		if (wsServer.clients.length < 5) {
			ws.on('message', function incoming(message) {
				boardClient.messageReceived(message);
			});

			ws.on('close', function() {
				boardClient.connectionClosed();
				wsServer.clients.splice(wsServer.clients.indexOf(boardClient), 1);
			});		

			wsServer.clients.push(boardClient);
		}
		else {
			boardClient.send("MAX_CONNECTIONS_REACHED");
			boardClient.close();
		}
	});
}