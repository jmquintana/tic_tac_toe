const X_CLASS = "x";
const O_CLASS = "o";
const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("restartButton");
const winningMessageTextElement = document.querySelector(
	"[data-winning-message-text]"
);

let oTurn;
let currentPlayer;

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
	oTurn = false;
	currentPlayer = "human";
	cellElements.forEach((cell) => {
		cell.classList.remove(X_CLASS);
		cell.classList.remove(O_CLASS);
		cell.removeEventListener("click", handleClick);
		cell.addEventListener("click", handleClick);
	});
	setBoardHoverClass();
	winningMessageElement.classList.remove("show");
}

function handleClick(e) {
	let cell;
	let currentClass = oTurn ? O_CLASS : X_CLASS;
	if (currentClass == X_CLASS) {
		cell = e.target;
	} else {
		cell = bestMove();
	}
	placeMark(cell, currentClass);
	if (checkWin(currentClass)) {
		endGame(false);
	} else if (isDraw()) {
		endGame(true);
	} else {
		swapTurns();
		handleClick();
		setBoardHoverClass();
	}
}

function bestMove() {
	let bestScore = -Infinity;
	let bestCell;
	let availableCells = getAvailableCells();
	for (let i = 0; i < availableCells.length; i++) {
		const cell = availableCells[i];
		cell.classList.add(O_CLASS);
		const cellScore = minimax(cell, 0, false);
		cell.classList.remove(O_CLASS);
		if (cellScore > bestScore) {
			bestScore = cellScore;
			bestCell = cell;
		}
	}
	return bestCell;
}

let scores = {
	X: -1,
	O: 1,
	tie: 0,
};

function minimax(board, depth, isMaximazing) {
	let availableCells = getAvailableCells();
	if (checkWin(X_CLASS)) {
		return scores.X;
	} else if (checkWin(O_CLASS)) {
		return scores.O;
	} else if (availableCells.length === 0) {
		return scores.tie;
	}
	if (isMaximazing) {
		let bestScore = -Infinity;
		for (let i = 0; i < availableCells.length; i++) {
			const cell = availableCells[i];
			cell.classList.add(O_CLASS);
			const cellScore = minimax(cell, depth + 1, false);
			cell.classList.remove(O_CLASS);
			bestScore = Math.max(bestScore, cellScore);
		}
		return bestScore;
	} else {
		let bestScore = Infinity;
		for (let i = 0; i < availableCells.length; i++) {
			const cell = availableCells[i];
			cell.classList.add(X_CLASS);
			const cellScore = minimax(cell, depth + 1, true);
			cell.classList.remove(X_CLASS);
			bestScore = Math.min(bestScore, cellScore);
		}
		return bestScore;
	}
}

function getAvailableCells() {
	let availableCells = [];
	cellElements.forEach((cell) => {
		if (
			!cell.classList.contains(X_CLASS) &&
			!cell.classList.contains(O_CLASS)
		) {
			availableCells.push(cell);
		}
	});
	return availableCells;
}

function endGame(draw) {
	if (draw) {
		winningMessageTextElement.innerText = "Draw!";
	} else {
		winningMessageTextElement.innerText = `${oTurn ? "O's" : "X's"} wins!`;
	}
	winningMessageElement.classList.add("show");
}

function isDraw() {
	return [...cellElements].every((cell) => {
		return cell.classList.contains(O_CLASS) || cell.classList.contains(X_CLASS);
	});
}

function placeMark(cell, currentClass) {
	cell.classList.add(currentClass);
	cell.removeEventListener("click", handleClick);
}

function swapTurns() {
	oTurn = !oTurn;
	currentPlayer = currentPlayer == "human" ? "computer" : "human";
	console.log(currentPlayer);
}

function setBoardHoverClass() {
	board.classList.remove(X_CLASS);
	board.classList.remove(O_CLASS);
	if (oTurn) {
		board.classList.add(O_CLASS);
	} else {
		board.classList.add(X_CLASS);
	}
}

function checkWin(currentClass) {
	return WINNING_COMBINATIONS.some((combination) => {
		return combination.every((index) => {
			return cellElements[index].classList.contains(currentClass);
		});
	});
}
