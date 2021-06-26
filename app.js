// "use strict";

var Player = (sign) => {
    this.sign = sign;

    var getSign = () => {
        return sign;
    };

    return { getSign };
};

var gameBoard = (() => {
    var board = ["", "", "", "", "", "", "", "", ""];

    var setField = (index, sign) => {
        if (index > board.length) return;
        board[index] = sign;
    };

    var getField = (index) => {
        if (index > board.length) return;
        return board[index];
    };

    var reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { setField, getField, reset };
})();

var displayController = (() => {
    var fieldElements = document.querySelectorAll(".field");
    var messageElement = document.getElementById("message");
    var restartButton = document.getElementById("restart-button");

    fieldElements.forEach((field) =>
        field.addEventListener("click", (e) => {
            if (gameController.getIsOver() || e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        })
    );

    restartButton.addEventListener("click", (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setMessageElement("Player X's turn");
    });

    var updateGameboard = () => {
        for (let i = 0; i < fieldElements.length; i++) {
            fieldElements[i].textContent = gameBoard.getField(i);
        }
    };

    var setResultMessage = (winner) => {
        if (winner === "Draw") {
            setMessageElement("It's a Tie!");
        } else {
            setMessageElement(`Player "${winner}" has won!`);
        }
    };

    var setMessageElement = (message) => {
        messageElement.textContent = message;
    };

    return { setResultMessage, setMessageElement };
})();

var gameController = (() => {
    var playerX = Player("X");
    var playerO = Player("O");
    var round = 1;
    var isOver = false;

    var playRound = (fieldIndex) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if (checkWinner(fieldIndex)) {
            displayController.setResultMessage(getCurrentPlayerSign());
            isOver = true;
            return;
        }
        if (round === 9) {
            displayController.setResultMessage("Draw");
            isOver = true;
            return;
        }
        round++;
        displayController.setMessageElement(
            `Player ${getCurrentPlayerSign()}'s turn`
        );
    };

    var getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };

    var checkWinner = (fieldIndex) => {
        var winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        return winConditions
            .filter((combination) => combination.includes(fieldIndex))
            .some((possibleCombination) =>
                possibleCombination.every(
                    (index) => gameBoard.getField(index) === getCurrentPlayerSign()
                )
            );
    };

    var getIsOver = () => {
        return isOver;
    };

    var reset = () => {
        round = 1;
        isOver = false;
    };

    return { playRound, getIsOver, reset };
})();