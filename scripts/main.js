const createPlayer = (name, token) => {
    let score = 0;
    const getScore = () => score;
    const addScore = () => ++score;
    return {
        name,
        token,
        getScore,
        addScore,
    };
}

const gameLogic = (() => {
    const playerOne = createPlayer("Antony", "x");
    const playerTwo = createPlayer("Tony", "o");
    let currentPlayer = playerOne;
    let winCondition = undefined;
    const startGame = () => {
        displayController.displayBoard();
    };
    const endGame = (type) => {
        if (type) {
            console.log(`${currentPlayer.name} wins!`);
            console.log(getWinCondition());
        } else {
            console.log(`It's a Tie! No moves remaining.`);
        }
    };
    const getCurrentPlayer = () => currentPlayer;
    const updateCurrentPlayer = () => {
        currentPlayer = (currentPlayer == playerOne) ? playerTwo : playerOne
    };

    const placeTokenAt = (unit) => {
        gameboard.setBoard(unit, currentPlayer.token);

        if (checkWin()) {
            endGame(1);
            // console.log("Player won!");
        } else if (checkTie()) {
            endGame(0)
            // console.log("It's a tie");
        } else {
            updateCurrentPlayer();
        }
    };

    const checkWin = () => {
        const winningConditions = [
            [0, 1, 2], //Top-Across
            [3, 4, 5], //Middle-Across
            [6, 7, 8], //Bottom-Across
            [0, 3, 6], //Left-Down
            [1, 4, 7], //Middle-Down
            [2, 5, 8], //Right-Down
            [0, 4, 8], //LR-Diagonal
            [2, 4, 6], //RL-Diagonal
        ];

        const checkedConditions = winningConditions.map((condition) => {
            return condition.map((position) => {
                return gameboard.getBoard()[position] === gameLogic.getCurrentPlayer().token;
            }).reduce((prevBool, currBool) => prevBool && currBool);
        });

        if (checkedConditions.indexOf(true) != -1) {
            winCondition = winningConditions[checkedConditions.indexOf(true)];
        }

        return checkedConditions.includes(true);
    };

    const getWinCondition = () => winCondition;

    const checkTie = () => {
        return !gameboard.getBoard().includes("_") && !checkWin();
    };

    return {
        startGame,
        endGame,
        getCurrentPlayer,
        updateCurrentPlayer,
        placeTokenAt,
        checkWin,
        getWinCondition,
        checkTie,
    };
})();

const gameboard = (() => {
    const board = new Array(9).fill('_');
    // const board = [
    //     `x`,`x`,`o`,
    //     `o`,`o`,`x`,
    //     `x`,`x`,`o`
    // ]
    const getBoard = () => board;
    const setBoard = (unit, token) => {
        board[unit] = token;
        displayController.displayBoard();
    };
    return {
        getBoard,
        setBoard,
    }
})();

const displayController = (() => {
    const displayBoard = () => {
        let board = '';
        gameboard.getBoard().forEach((unit, i) => {
            board += ((i + 1) % 3 === 0) ? `|${unit}|\n` : `|${unit}`;
        });
        console.log(board);
    }
    return {
        displayBoard,
    };
})();


gameLogic.startGame();
// TIE GAME
// gameLogic.placeTokenAt(0);
// gameLogic.placeTokenAt(3);
// gameLogic.placeTokenAt(1);
// gameLogic.placeTokenAt(4);
// gameLogic.placeTokenAt(5);
// gameLogic.placeTokenAt(2);
// gameLogic.placeTokenAt(6);
// gameLogic.placeTokenAt(7);
// gameLogic.placeTokenAt(8);
// Player One Wins
// gameLogic.placeTokenAt(0);
// gameLogic.placeTokenAt(1);
// gameLogic.placeTokenAt(4);
// gameLogic.placeTokenAt(3);
// gameLogic.placeTokenAt(8);
// Player Two Wins
// gameLogic.placeTokenAt(0);
// gameLogic.placeTokenAt(2);
// gameLogic.placeTokenAt(1);
// gameLogic.placeTokenAt(4);
// gameLogic.placeTokenAt(3);
// gameLogic.placeTokenAt(6);