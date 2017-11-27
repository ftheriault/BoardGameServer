var ws = null;
var container = null;
var serverLocation = 'localhost:4663';

window.onload = function () {
	container = document.getElementById("container");
	ws = new WebSocket('ws://' + serverLocation);

	ws.onopen = function(){
		ws.send(JSON.stringify("gomoku"));
	}

	ws.onmessage = function(e){
		var serverMessage = e.data;
		appendMessage(JSON.parse(serverMessage));
	}

	ws.onclose = function(){
	}

	ws.onerror = function(error){
		console.log(error)
	}
}

function play(i, j) {
	ws.send(JSON.stringify(new Array(i, j)));
}

function appendMessage(message) {	
	if (message instanceof Array) {
		let container = document.getElementById("result");
		container.innerHTML = "";

		for (let i = 0; i < message.length; i++) {
			for (let j = 0; j < message[i].length; j++) {
				let val = message[i][j];
				let node = document.createElement("div");
				node.className = "cell";
				
				if (val == 0) {
					node.onclick = function () {
						play(i, j);
					}

					node.innerHTML = "&nbsp;";
				}
				else if (val == 1) {
					node.innerHTML = "<div class='player-cell'>&nbsp;</div>";
				}
				else {
					node.innerHTML = "<div class='ai-cell'>&nbsp;</div>";
				}
				
				container.appendChild(node);	
			}
			
			container.appendChild(document.createElement("br"));
		}
	}
	else {
		alert(message);
	}
}

