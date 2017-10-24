# BoardGameServer
Tiny server for board games, that can be played in a browser or by creating your own app that connect to it using a socket. The server can serve different kind of games, and has an AI to play against you.

## Start the server

The first time, run the following command.

````
npm install
````

Then, to start the server :

````
node server/main.js
````

## Supported boards

At this point, only the "gomoku" game is supported.

## Play a game against the AI using a socket

### Socket information

The server listens on port 4663

### First message

The first message to send, before the game starts, is the game type wanted. For now, only "gomoku" is supported, hence a message with "gomoku" must be sent.

### Other messages

After the first message is sent, the player receives the current board state. It is now up to him to play his turn. For the gomoku game, an array of 2 elements, line index and column index must be sent to the server, JSON encoded. 

After receving a message from the player, the server will update the board, make his move, and sent the new board state back.

The previous steps can be done until the end of the game.

### Possible messages sent from the server

* DRAW = The game is a draw
* PLAYER_WIN = The game was won by player
* AI_WIN = The game was won by AI
* MAX_CONNECTIONS_REACHED = Cannot start new board game, server is full
* an array of 2 dimensions = The current board game state. 
