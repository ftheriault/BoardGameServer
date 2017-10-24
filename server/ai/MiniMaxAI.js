module.exports = MiniMaxAI = function (gameBoard, client) {
	this.maxDepth = 2;

	this.miniMax = function (board, depth, maximizeAI) {
		if (depth == 0) {
			let state = client.checkBoardState(board);
			return [-1, -1, state[1] - state[0]];
		}
		
		if (maximizeAI) {
			let bestMove = [0, 0, -100000];
			let freeCells = client.getFreeCells(board);
			
			for (let i = 0; i < freeCells.length; i++) {
				let b = client.copyBoard(board);
				b[freeCells[i][0]][freeCells[i][1]] = 2;

				let tmp = this.miniMax(b, depth - 1, false);

				if (tmp[2] > bestMove[2]) {
					tmp[0] = freeCells[i][0];
					tmp[1] = freeCells[i][1];
					bestMove = tmp;
				}
			}
			
			return bestMove;
		}
		else {
			let bestMove = [0, 0, 1000000];
			let freeCells = client.getFreeCells(board);

			for (let i = 0; i < freeCells.length; i++) {
				let b = client.copyBoard(board);
				b[freeCells[i][0]][freeCells[i][1]] = 1;

				let tmp = this.miniMax(b, depth - 1, true);

				if (tmp[2] < bestMove[2]) {
					tmp[0] = freeCells[i][0];
					tmp[1] = freeCells[i][1];
					bestMove = tmp;
				}
			}

			return bestMove;
		}

		return bestMove;
	}

	this.run = function () {
		let move = this.miniMax(client.copyBoard(gameBoard), 3, true);
		
		return new Array(move[0], move[1]);
	}

}