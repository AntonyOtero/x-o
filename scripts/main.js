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
    const newGame = () => {
        if (document.querySelector(".board")) {
            document.querySelector(".container").classList.toggle("disable");
            gameUI.removeBoardUI();
            gameUI.removeNotification();
        }
        gameUI.displayPlayerInfoUI();
    }
    const startGame = () => {
        // Initialize gameMemory
        gameMemory.initializeMemory();
        const PlayerOneInput = document.querySelector("#player-one");
        const PlayerTwoInput = document.querySelector("#player-two");
        gameMemory.updatePlayerOne(createPlayer(PlayerOneInput.value, "X"));
        gameMemory.updatePlayerTwo(createPlayer(PlayerTwoInput.value, "O"));
        // set current player
        gameMemory.initializeCurrentPlayer();
        // remove player info UI
        gameUI.removePlayerInfoUI();
        // Display gameboard UI
        gameUI.displayBoardUI();
        // Wait for player input
    }
    const restartGame = () => {
        gameUI.removeNotification();
        gameMemory.initializeMemory();
        gameMemory.initializeCurrentPlayer();
        gameUI.restartBoardUI();
    }
    const placeTokenAtIndex = (i) => {
        if (!gameMemory.getMemory()[i]) {
            gameMemory.updateMemory(i);
            gameUI.updateBoardUI();
            if (gameMemory.isWin()) {
                gameUI.highlightWin(gameMemory.getWinningCondition());
                gameUI.displayNotification(1);
            } else if (gameMemory.isTie()) {
                gameUI.displayNotification(0);
            } else {
                gameMemory.updateCurrentPlayer();
            }
        }
    }

    return {
        newGame,
        startGame,
        restartGame,
        placeTokenAtIndex,
    }
})();

const gameMemory = (() => {
    let playerOne, playerTwo, currentPlayer, winningCondition, memory;
    const winConditions = [
        [0, 1, 2], //Top-Across
        [3, 4, 5], //Middle-Across
        [6, 7, 8], //Bottom-Across
        [0, 3, 6], //Left-Down
        [1, 4, 7], //Middle-Down
        [2, 5, 8], //Right-Down
        [0, 4, 8], //LR-Diagonal
        [2, 4, 6], //RL-Diagonal
    ];
    const initializeMemory = () => memory = new Array(9).fill("");
    const initializeCurrentPlayer = () => currentPlayer = getPlayerOne();
    const getPlayerOne = () => playerOne;
    const getPlayerTwo = () => playerTwo;
    const getCurrentPlayer = () => currentPlayer;
    const getWinningCondition = () => winningCondition;
    const getMemory = () => memory;
    const updatePlayerOne = (newPlayer) => playerOne = newPlayer;
    const updatePlayerTwo = (newPlayer) => playerTwo = newPlayer;
    const updateCurrentPlayer = () => currentPlayer = (currentPlayer == playerOne) ? playerTwo : playerOne;
    const updateWinningCondition = (condition) => winningCondition = condition;
    const updateMemory = (i) => {
        if (memory[i] == "") memory[i] = getCurrentPlayer().token;
    }
    const isWin = () => {
        const winCheck = winConditions.map((condition) => {
            return condition.map(winIndex => {
                return memory[winIndex] === currentPlayer.token;
            }).reduce((prevWinBool, curWinBool) => {
                return prevWinBool && curWinBool;
            });
        });

        if (winCheck.includes(true)) {
            updateWinningCondition(winConditions[winCheck.indexOf(true)]);
        }

        return winCheck.includes(true);
    }
    const isTie = () => {
        return !memory.includes("");
    }

    return {
        initializeMemory,
        initializeCurrentPlayer,
        getPlayerOne,
        getPlayerTwo,
        getCurrentPlayer,
        getWinningCondition,
        getMemory,
        updatePlayerOne,
        updatePlayerTwo,
        updateCurrentPlayer,
        updateWinningCondition,
        updateMemory,
        isWin,
        isTie,
    }
})();

const gameUI = (() => {
    const Container = document.querySelector(".container");
    const displayPlayerInfoUI = () => {
        const PlayerInfo = document.createElement("div");
        PlayerInfo.setAttribute("id", "player-info");
        PlayerInfo.classList.add("card");
        PlayerInfo.innerHTML = `
            <p class="player">
                Player One is <input id="player-one" type="text" placeholder="P1 Name Here"> as X
            </p>
            <p class="player">
                Player Two is <input id="player-two" type="text" placeholder="P2 Name Here"> as O
            </p>
            <button class="btn start-btn" onclick="gameLogic.startGame()">Start</button>
        `
        Container.appendChild(PlayerInfo);
    }
    const displayBoardUI = () => {
        const Board = document.createElement("div");
        Board.classList.add("board");
        Container.appendChild(Board);
        gameMemory.getMemory().forEach((cell, i) => {
            const Unit = document.createElement("div");
            Unit.classList.add("unit");
            Unit.textContent = cell;
            Unit.setAttribute("onclick", `gameLogic.placeTokenAtIndex(${i})`);
            Board.appendChild(Unit);
        });
    }
    const displayNotification = (type) => {
        Container.classList.toggle("disable");
        const Notification = document.createElement("div");
        Notification.classList = "notification card";
        document.body.appendChild(Notification);
        if (type == 1) {
            Notification.textContent = `${gameMemory.getCurrentPlayer().name} won!`;
        } else {
            Notification.textContent = "It's a tie! No more moves possible."
        }
        const RematchButton = document.createElement("button");
        RematchButton.classList.add("btn");
        RematchButton.textContent = "Rematch";
        RematchButton.setAttribute("onclick", "gameLogic.restartGame()");
        const NewGameButton = document.createElement("button");
        NewGameButton.classList.add("btn");
        NewGameButton.textContent = "New Game";
        NewGameButton.setAttribute("onclick", "gameLogic.newGame()");
        Notification.appendChild(RematchButton);
        Notification.appendChild(NewGameButton);
    }
    const removePlayerInfoUI = () => {
        document.querySelector("#player-info").remove();
    }
    const removeBoardUI = () => {
        document.querySelector(".board").remove();
    }
    const removeNotification = () => {
        document.querySelector(".notification").remove();
    }
    const updateBoardUI = () => {
        removeBoardUI();
        displayBoardUI();
    }
    const highlightWin = (condition) => {
        const WinningUnits = document.querySelectorAll(".unit");
        condition.forEach(winIndex => WinningUnits[winIndex].classList.add("highlight"));
    }
    const restartBoardUI = () => {
        removeBoardUI();
        displayBoardUI();
        document.querySelector(".container").classList.toggle("disable");
    }

    return {
        displayPlayerInfoUI,
        displayBoardUI,
        displayNotification,
        removePlayerInfoUI,
        removeBoardUI,
        removeNotification,
        updateBoardUI,
        highlightWin,
        restartBoardUI,
    }
})();

gameLogic.newGame();