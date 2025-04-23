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
        return displayController.displayBoard();
    };
    const getCurrentPlayer = () => currentPlayer;
    const updateCurrentPlayer = () => {
        currentPlayer = (currentPlayer == playerOne) ? playerTwo : playerOne
    };
    const checkWin = () => {
        const winningConditions = [
            [0,1,2], //Top-Across
            [3,4,5], //Middle-Across
            [6,7,8], //Bottom-Across
            [0,3,6], //Left-Down
            [1,4,7], //Middle-Down
            [2,5,8], //Right-Down
            [0,4,8], //LR-Diagonal
            [2,4,6], //RL-Diagonal
        ];

        const checkedConditions = winningConditions.map((condition) => {
            return condition.map((position) => {
                return gameboard.getBoard()[position] === gameLogic.getCurrentPlayer().token;
            }).reduce((prevBool, currBool) => prevBool && currBool);
        });

        if (checkedConditions.indexOf(true) != -1) {
            winCondition = winningConditions[checkedConditions.indexOf(true)];
        }

        return checkedConditions;
    };

    const getWinCondition = () => winCondition;

    const checkTie = () => {
        return !gameboard.getBoard().includes("_") && !winCondition;
    };

    return {
        startGame,
        getCurrentPlayer,
        updateCurrentPlayer,
        checkWin,
        getWinCondition,
        checkTie,
    };
})();

const gameboard = (() => {
    // const memory = new Array(9).fill('_');
    const board = [
        `x`,`x`,`o`,
        `o`,`o`,`x`,
        `x`,`x`,`o`
    ]
    const getBoard = () => board;
    return {
        getBoard,
    }
})();

const displayController = (() => {
    const displayBoard = () => {
        let board = '';
        gameboard.getBoard().forEach((unit, i) => {
            board += ((i + 1) % 3 === 0) ? `|${unit}|\n` : `|${unit}`;
        });
        return board;
    }
    return {
        displayBoard,
    };
})();

console.log(gameboard.getBoard());
console.log(gameLogic.startGame());
console.log(gameLogic.getCurrentPlayer());
console.log(gameLogic.checkWin());
console.log(gameLogic.getWinCondition());
console.log(gameLogic.checkTie());