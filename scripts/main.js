const createPlayer = (name, token, piece) => {
    let score = 0;
    const getScore = () => score;
    const addScore = () => ++score;
    return {
        name,
        token,
        piece,
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
        currentPlayer = playerOne;
        displayController.displayBoard();
    };
    const restartGame = () => {
        currentPlayer = playerOne;
        gameboard.restartMemory();
        displayController.updateBoard();
        displayController.removeNotification();
    }
    const endGame = (type) => {
        if (type) {
            displayController.displayNotification(`${currentPlayer.name} wins!`);
            displayController.displayWinCondition(getWinCondition());
        } else {
            displayController.displayNotification("It's a Tie! No moves remaining.");
        }
    };
    const getCurrentPlayer = () => currentPlayer;
    const updateCurrentPlayer = () => {
        currentPlayer = (currentPlayer == playerOne) ? playerTwo : playerOne
    };

    const placeTokenAt = (unit) => {
        gameboard.updateMemory(unit, currentPlayer.token);

        if (checkWin()) {
            endGame(1);
        } else if (checkTie()) {
            endGame(0)
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
                return gameboard.getMemory()[position] === gameLogic.getCurrentPlayer().token;
            }).reduce((prevBool, currBool) => prevBool && currBool);
        });

        if (checkedConditions.indexOf(true) != -1) {
            winCondition = winningConditions[checkedConditions.indexOf(true)];
        }

        return checkedConditions.includes(true);
    };

    const getWinCondition = () => winCondition;

    const checkTie = () => {
        return !gameboard.getMemory().includes("") && !checkWin();
    };

    return {
        startGame,
        endGame,
        restartGame,
        getCurrentPlayer,
        updateCurrentPlayer,
        placeTokenAt,
        checkWin,
        getWinCondition,
        checkTie,
    };
})();

const gameboard = (() => {
    let memory = new Array(9).fill("");
    const getMemory = () => memory;
    const updateMemory = (unit, token) => {
        memory[unit] = token;
        displayController.updateBoard();
    };
    const restartMemory = () => memory = new Array(9).fill("");
    return {
        getMemory,
        updateMemory,
        restartMemory,
    }
})();

const displayController = (() => {
    const Container = document.querySelector(".container");
    const displayBoard = () => {
        const Gameboard = document.createElement("div")
        Gameboard.classList.add("gameboard");
        Container.appendChild(Gameboard);
        gameboard.getMemory().forEach((unit) => {
            const GameboardUnit = document.createElement("div");
            GameboardUnit.classList.add("unit");
            GameboardUnit.innerHTML = unit;
            Gameboard.appendChild(GameboardUnit);
        });
        document.querySelectorAll(".unit").forEach((unit, i) => {
            unit.addEventListener("click", e => {
                gameLogic.placeTokenAt(i);
            });
        });
    }
    const removeBoard = () => {
        document.querySelector(".gameboard").remove();
    }
    const updateBoard = () => {
        removeBoard();
        displayBoard();
    }
    const displayPlayerInfo = () => {
        const PlayerInfo = document.createElement("div");
        PlayerInfo.classList = "player-info notification";
        Container.appendChild(PlayerInfo);
        PlayerInfo.innerHTML = `
            <p class="player">
                Player One is <input id="player-one" type="text" placeholder="P1 Name Here"> as X
            </p>
            <p class="player player-two">
                Player Two is <input id="player-two" type="text" placeholder="P2 Name Here"> as O
            </p>
            <button class="btn start-btn">Start</button>
        `
    }
    const displayNotification = (message) => {
        const Notification = document.createElement("div");
        Notification.classList.add("notification");
        document.body.appendChild(Notification);
        Notification.textContent = message;
        Container.classList.toggle("disable");
        const ReplayButton = document.createElement("button");
        ReplayButton.classList.add("btn");
        ReplayButton.textContent = "Rematch";
        Notification.appendChild(ReplayButton);
        ReplayButton.addEventListener("click", e => {
            gameLogic.restartGame();
        });
    }
    const removeNotification = () => {
        document.querySelector(".notification").remove();
        Container.classList.toggle("disable");
    }
    const displayWinCondition = (winCondition) => {
        const Units = document.querySelectorAll(".unit");
        winCondition.forEach(winUnitIndex => {
            Units[winUnitIndex].classList.toggle("highlight");
        });
    }

    return {
        displayBoard,
        removeBoard,
        updateBoard,
        displayPlayerInfo,
        displayNotification,
        removeNotification,
        displayWinCondition,
    };
})();

displayController.displayPlayerInfo();
// gameLogic.startGame();
// displayController.displayNotification();
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