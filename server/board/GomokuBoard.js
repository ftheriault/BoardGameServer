var MiniMaxAI = require("../ai/MiniMaxAI");

module.exports = GomokuBoard = function(client) {
	this.client = client;
	this.gameBoard = null;
	this.playerTurn = true;

	this.processMessage = function (message) {
		if (this.playerTurn) {
			if (message instanceof Array) {
				if (this.gameBoard[message[0]][message[1]] == 0) {
					this.gameBoard[message[0]][message[1]] = 1;
					this.playerTurn = false;
				}
			}
		}
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

	this.getFreeCells = function (board) {
		let free = [];

		for (let i = 0; i < 15; i++) {
			for (let j = 0; j < 15; j++) {
				if (board[i][j] == 0) {
					free.push([i, j]);
				}
			}
		}

		return free;
	}

	this.initGame = function () {
		this.gameBoard = new Array();

		for (let i = 0; i < 15; i++) {
			let line = new Array();

			for (let j = 0; j < 15; j++) {
				line[j] = 0;
			}

			this.gameBoard.push(line);
		}

		// half the chance the first player is AI
		if (Math.random() < 0.5) {			
			let i = Math.floor(Math.random() * 15);
			let j = Math.floor(Math.random() * 15);
			this.gameBoard[i][j] = 2;
			this.playerTurn = true;
		}

		client.send(this.gameBoard);
	}

	this.checkWinAt = function (board, i, j, playerNum) {
		let count = 0;
		let maxCount = 0;

		// line
		for (var t =  -4; t <= +4; t++) {
			if (i + t >= 0 && i + t < 15 && board[i + t][j] == playerNum) {
				count++;
				if (count > maxCount) maxCount = count;
			}
			else {
				count = 0;
			}
		}

		// col
		if (maxCount < 5) {
			count = 0;

			for (var t = -4; t <= 4; t++) {
				if (j + t >= 0 && j + t < 15 && board[i][j + t] == playerNum) {
					count++;
					if (count > maxCount) maxCount = count;
				}
				else {
					count = 0;
				}
			}	
		}
		
		// diag 1
		if (maxCount < 5) {
			count = 0;
			
			for (var t = -4; t <= 4; t++) {
				if (i + t >= 0 && i + t < 15 && 
					j + t >= 0 && j + t < 15 && board[i + t][j + t] == playerNum) {
					count++;
					if (count > maxCount) maxCount = count;
				}
				else {
					count = 0;
				}
			}			
		}

		// diag 2
		if (maxCount < 5) {
			count = 0;
			
			for (var t = -4; t <= 4; t++) {
				if (i + t >= 0 && i + t < 15 && 
					j + t >= 0 && j + t < 15 && board[i + t][j - t ] == playerNum) {
					count++;
					if (count > maxCount) maxCount = count;
				}
				else {
					count = 0;
				}			
			}	
		}

		return maxCount;
	}

	this.checkBoardState = function (board) {
		let maxPlayer = 0;
		let maxAI = 0;

		for (let i = 0; i < 15; i++) {
			for (let j = 0; j < 15; j++) {
				let tmp = this.checkWinAt(board, i, j, 1)
				if (tmp > maxPlayer) {
					maxPlayer = tmp;
				}

				tmp = this.checkWinAt(board, i, j, 2);
				if (tmp > maxAI) {
					maxAI = tmp;
				}
			}
		}

		return [maxPlayer, maxAI];
	}

	this.tick = function () {
		if (!this.playerTurn) {
			if (this.getFreeCells(this.gameBoard).length > 0) {
				this.playerTurn = true;
				
				let played = false;

				let ai = new MiniMaxAI(this.gameBoard, this);
				let result = ai.run();
				this.gameBoard[result[0]][result[1]] = 2;
				played = true;

				let winState = this.checkBoardState(this.gameBoard);

				if (winState[0] < 5 && winState[1] < 5) {
					client.send(this.gameBoard);
				}
				else {
					client.send(winState[0] >= 5 ? "PLAYER_WIN" : "AI_WIN");
					client.close();
				}
			}
			else {
				client.send("DRAW");
				client.close();
			}
		}
	}
}