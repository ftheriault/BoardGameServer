module.exports = MiniMaxAI = function (gameBoard, client) {
	this.maxDepth = 2;

	this.miniMax = function (board, depth, maximizeAI) {
		if (depth == 0) {
			let freeCells = client.getFreeCells(board);
			let rndMove = freeCells[Math.floor(Math.random() * freeCells.length)];
			let state = client.checkBoardState(board);
			return [rndMove[0], rndMove[1], state[1] - state[0]];
		}
		
		if (maximizeAI) {
			let freeCells = client.getFreeCells(board);
			let rndMove = freeCells[Math.floor(Math.random() * freeCells.length)];
			let bestMove = [rndMove[0], rndMove[1], -10000];

			for (let i = 0; i < 15; i++) {
				for (let j = 0; j < 15; j++) {
					if (board[i][j] == 0) {
						let b = client.copyBoard(board);
						b[i][j] = 2;
						let tmp = this.miniMax(b, depth - 1, false);

						if (tmp[2] > bestMove[2]) {
							bestMove = tmp;
						}
					}
				}
			}
			
			return bestMove;
		}
		else {
			let freeCells = client.getFreeCells(board);
			let rndMove = freeCells[Math.floor(Math.random() * freeCells.length)];
			let bestMove = [rndMove[0], rndMove[1], 1000000];

			for (let i = 0; i < 15; i++) {
				for (let j = 0; j < 15; j++) {
					if (board[i][j] == 0) {
						let b = client.copyBoard(board);
						b[i][j] = 1;
						let tmp = this.miniMax(b, depth - 1, true);

						if (tmp[2] < bestMove[2]) {
							bestMove = tmp;
						}
					}
				}
			}

			return bestMove;
		}

		return bestMove;
	}

	this.run = function () {
		let move = this.miniMax(client.copyBoard(gameBoard), 2, true);
		
		return new Array(move[0], move[1]);
	}

}