var GomokuBoard = require("./GomokuBoard");

module.exports = BoardClient = function(ws) {
	this.ws = ws;
	this.board = null;
	this.gameBoard = null;
	this.playerTurn = true;

	//console.log("- New client connected");

	this.messageReceived = function (message) {
		message = JSON.parse(message);

		if (this.board == null) {
			if (message === "gomoku") {
				this.board = new GomokuBoard(this);
				this.board.initGame();
			}
		}
		else {
			this.board.processMessage(message);
		}
	}

	this.connectionClosed = function () {
		//console.log("- Client WebSocket closed")
	}

	this.send = function (message) {
		this.ws.send(JSON.stringify(message));
	}

	this.close = function () {
		ws.close();
	}

	this.copyBoard = function(board) {
		var tmp = [];

		for (let i = 0; i < 15; i++) {
			let line = new Array();

			for (let j = 0; j < 15; j++) {
				line[j] = board[i][j];
			}

			tmp.push(line);
		}

		return tmp;
	}

	this.tick = function () {
		if (this.board != null) {
			this.board.tick();
		}
	}
}