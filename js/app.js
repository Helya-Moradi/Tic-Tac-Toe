let playVersusBtns = document.querySelectorAll('.playVersusBtn');
let symbolBtns = document.querySelectorAll('.symbolBtn');
let playBtn = document.querySelector('.playBtn');
let gameContainer = document.querySelector('.gameContainer');
let gameModeContainer = document.querySelector('.gameModeContainer');
let modeArray;

playVersusBtns.forEach(playVersusBtn => {
    playVersusBtn.addEventListener('click', () => {
        removeAllErrFromModeBtn(playVersusBtns);
        removeAllActiveFromModeBtns(playVersusBtns);
        addActiveToModeBtn(playVersusBtn);
    })
})

symbolBtns.forEach(symbolBtn => {
    symbolBtn.addEventListener('click', () => {
        removeAllErrFromModeBtn(symbolBtns);
        removeAllActiveFromModeBtns(symbolBtns);
        addActiveToModeBtn(symbolBtn);
    })
})

function removeAllActiveFromModeBtns(btns) {
    btns.forEach(btn => {
        btn.classList.remove('active');
    })
}

function addActiveToModeBtn(btn) {
    btn.classList.add('active');
}

playBtn.addEventListener('click', () => {
    let activeplayVersusBtn = [...playVersusBtns].find(findActiveModeBtn);
    let activeSymbolBtn = [...symbolBtns].find(findActiveModeBtn);

    if (activeSymbolBtn && activeplayVersusBtn) {

        goToGameContainer();
        modeArray = {
            savePlayMode: activeplayVersusBtn.id,
            savePlayer: activeSymbolBtn.innerHTML
        };
        mainGame();

    } else {
        if (!activeplayVersusBtn) {
            playVersusBtns.forEach(addErrToModeBtn);
        }
        if (!activeSymbolBtn) {
            symbolBtns.forEach(addErrToModeBtn);
        }
    }
})

function findActiveModeBtn(btn) {
    return btn.classList.contains('active');
}

function goToGameContainer() {
    gameContainer.classList.add('active');
    gameModeContainer.classList.add('active');
}

function addErrToModeBtn(btn) {
    btn.classList.add('err');
}

function removeAllErrFromModeBtn(btns) {
    btns.forEach(btn => {
        btn.classList.remove('err');
    })
}

function mainGame() {
    let BOARD = ["", "", "", "", "", "", "", "", ""];

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


    let selectedPlayer = modeArray.savePlayer;
    const player = [selectedPlayer, (selectedPlayer === 'X') ? 'O' : 'X'];

    let humanTurn;
    let currentPlayer;
    let result;
    let combinationArray = [];
    let running = false;

    const statusText = document.querySelector(".statusText");
    const cellElements = document.querySelectorAll(".cell");
    const btnRestart = document.querySelector(".restartBtn");

    function startGame() {
        humanTurn = true;
        result = "";
        currentPlayer = player[0];
        runGame();
    }

    startGame();

    btnRestart.addEventListener("click", restart);

    function restart() {
        cellElements.forEach((cell) => {
            cell.innerHTML = '';
            cell.classList.remove('winner');
        });
        result = "";
        running = false;
        BOARD = ["", "", "", "", "", "", "", "", ""];
        startGame();
    }

    function runGame() {

        if (gameResult()) {
            if (result === "Tie") {
                statusText.innerHTML = `${result}!`;
            } else {
                changeWinnerBlockColor(combinationArray);
                statusText.innerHTML = `${result} wins!`;
            }
        } else {
            if (humanTurn) {
                statusText.innerHTML = `${player[0]}'s turn`;
                currentPlayer = player[0];
                humanPlay();
            } else {
                statusText.innerHTML = `${player[1]}'s turn`;
                currentPlayer = player[1];
                (modeArray.savePlayMode === 'computer') ? botPlay(): humanPlay();
            }
        }
    }


    function swapTurn() {
        humanTurn = !humanTurn;
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
    }

    function gameResult() {
        result = checkWinner();
        if (result === "") {
            return false;
        } else {
            running = true;
            return true;
        }
    }

    function checkWinner() {
        let winner = "";
        // ? check game result and return result
        WINNING_COMBINATIONS.forEach((combination) => {
            if (
                BOARD[combination[0]] === "X" &&
                BOARD[combination[1]] === "X" &&
                BOARD[combination[2]] === "X"
            ) {
                combinationArray = combination;
                winner = "X";

            } else if (
                BOARD[combination[0]] === "O" &&
                BOARD[combination[1]] === "O" &&
                BOARD[combination[2]] === "O"
            ) {
                combinationArray = combination;
                winner = "O";
            }
        });
        if (winner === "") {
            let value = 0;
            BOARD.forEach((item) => {
                if (!(item === "")) {
                    value += 1;
                }
            });
            if (value === 9) {
                winner = "Tie";
            } else {
                winner = "";
            }
        }
        return winner;
    }

    function changeWinnerBlockColor(combination) {
        cellElements.forEach(cell => {
            if (cell.id == combination[0] || cell.id == combination[1] || cell.id == combination[2]) {
                cell.classList.add('winner')
            }
        })
    }

    function humanPlay() {
        // ? gameplay of human
        cellElements.forEach((cell) => {
            cell.addEventListener("click", handleClick, false);
        });
    }

    function handleClick(e) {

        if (e.target.innerHTML === '' && !running) {
            if (modeArray.savePlayMode === 'computer') {
                e.target.innerHTML = player[0];
                let id = e.target.id;
                BOARD[id] = player[0];
            } else {
                e.target.innerHTML = currentPlayer;
                let id = e.target.id;
                BOARD[id] = currentPlayer;
            }
            swapTurn();
            runGame();
        }
    }

    function botPlay() {
        // ? gameplay of bot
        setTimeout(() => {
            let move = botMove();
            cellElements[move].innerHTML = player[1];
            BOARD[move] = player[1];
            swapTurn();
            runGame();
        }, 300);
    }

    function botMove() {
        let move = 0;

        move = bestMove();
        return move;
    }

    function bestMove() {
        let bestScore = -99999999;
        let move;

        let score;
        for (let i = 0; i < BOARD.length; i++) {
            if (BOARD[i] === "") {
                BOARD[i] = player[1];
                score = minimax(BOARD, false);
                BOARD[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    let scores = {
        Player: -1,
        Bot: 1,
        Tie: 0,
    };

    function minimax(newBoard, isMaximizing) {
        let scores = {
            X: (player[0] === "X") ? -10 : 10,
            O: (player[0] === "X") ? 10 : -10,
            Tie: 0,
        };
        let newResult = checkWinner();
        if (newResult !== "") {
            return scores[newResult];
        }
        if (isMaximizing) {
            let bestScore = -Infinity;
            let score;
            for (let i = 0; i < newBoard.length; i++) {
                if (newBoard[i] === "") {
                    newBoard[i] = player[1];
                    score = minimax(newBoard, false);

                    newBoard[i] = "";
                    if (score > bestScore) {
                        bestScore = score;
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            let score;
            for (let i = 0; i < newBoard.length; i++) {
                if (newBoard[i] === "") {
                    newBoard[i] = player[0];
                    score = minimax(newBoard, true);

                    newBoard[i] = "";
                    if (score < bestScore) {
                        bestScore = score;
                    }
                }
            }
            return bestScore;
        }

    }
}