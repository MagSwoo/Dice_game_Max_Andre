let inPreGameRoll = true;
let preGameRolls = { player1: 0, player2: 0 };
let originalPlayerNames = { player1: "", player2: "" };

let roundInput = document.querySelector('.rounds');
let startButton = document.querySelector(".start_button");
let rollButton = document.querySelector(".roll_button");
let winnertxt = "";

let gameInfo = document.getElementById("game_info");
let diceDisplay = document.getElementById('dice_display');

let player1Name, player2Name;
let rounds, currentPlayer, player1Score, player2Score, player1RoundsWon, player2RoundsWon, currentRound, rollCount;

startButton.addEventListener("click", function () {
    rounds = parseInt(roundInput.value);
    if (rounds % 2 === 0 || isNaN(rounds)) {
        alert("Please enter a valid odd number of rounds.");
        return;
    }

    player1Name = document.getElementById("player1Name").value || "Player 1";
    player2Name = document.getElementById("player2Name").value || "Player 2";

    roundInput.disabled = true;
    currentPlayer = 1;
    player1Score = player2Score = player1RoundsWon = player2RoundsWon = 0;
    currentRound = 1;
    rollCount = 0;
    startButton.classList.add("hidden");
    rollButton.textContent = "Roll Dice";
    rollButton.classList.remove("hidden");
    startNewRound();

    originalPlayerNames.player1 = document.getElementById("player1Name").value || "Player 1";
    originalPlayerNames.player2 = document.getElementById("player2Name").value || "Player 2";

    inPreGameRoll = true;
    currentPlayer = 1;
    diceDisplay.innerHTML = `Pre-game Roll - ${originalPlayerNames.player1}'s Turn<br>`;
});

rollButton.addEventListener("click", function () {
    if (rollButton.textContent === "Start Rounds") {
        rollButton.textContent = "Roll Dice";
        updateGameInfo();
    } else if (rollButton.textContent === "Next Round") {
        calculateRoundWinner();
        if (currentRound <= rounds) {
            startNewRound();
            rollButton.textContent = "Roll Dice";
        } else {
            endGame();
        }
    } else if (rollButton.textContent === "Restart Game") {
        refreshPage();
    } else {
        if (inPreGameRoll) {
            performPreGameRoll();
        } else if (currentRound <= rounds) {
            performRoll();
            updateGameInfo();
        }
    }
});


function performRoll() {
    if (inPreGameRoll) {
        performPreGameRoll();
    } else {
        if (rollCount < 3) {
            let roll = rollDice();
            diceDisplay.innerHTML += `Roll ${rollCount + 1}: ${roll}<br>`;
            if (currentPlayer === 1) {
                player1Score += roll;
            } else {
                player2Score += roll;
            }
            rollCount++;
        }
        if (rollCount === 3) {
            let currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
            diceDisplay.innerHTML += `${currentPlayerName} Round Score: ${currentPlayer === 1 ? player1Score : player2Score}<br>`;
            if (currentPlayer === 1) {
                currentPlayer = 2;
                diceDisplay.innerHTML = diceDisplay.innerHTML + `Round ${currentRound} - ${player2Name}'s Turn<br>`;
                rollCount = 0;
            } else {
                rollButton.textContent = "Next Round";
            }
        }
    }
}
    
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function calculateRoundWinner() {
    if (player1Score > player2Score) {
        player1RoundsWon++;
    } else if (player2Score > player1Score) {
        player2RoundsWon++;
    }
    currentRound++;
    player1Score = player2Score = 0;
}


function startNewRound() {
    rollCount = 0;
    currentPlayer = 1;
    let currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
    diceDisplay.innerHTML = diceDisplay.innerHTML + `Round ${currentRound} - ${currentPlayerName}'s Turn<br>`;
}

function updateGameInfo() {
    gameInfo.innerHTML = `Round: ${currentRound}/${rounds}<br>
                          ${player1Name} Score: ${player1Score} (Rounds Won: ${player1RoundsWon})<br>
                          ${player2Name} Score: ${player2Score} (Rounds Won: ${player2RoundsWon})<br>
                          Current Turn: ${currentPlayer === 1 ? player1Name : player2Name}`;
    if(currentRound >= rounds) {
        gameInfo.innerHTML = `Round: ${currentRound}/${rounds}<br>
                              ${player1Name} Score: ${player1Score} (Rounds Won: ${player1RoundsWon})<br>
                              ${player2Name} Score: ${player2Score} (Rounds Won: ${player2RoundsWon})<br>
                              ${winnertxt}`;
    }
}

function endGame() {
    let winnerName = player1RoundsWon > player2RoundsWon ? player1Name : player2Name;
    winnertxt = player1RoundsWon != player2RoundsWon ? winnerName + " wins the game!" : "It's a draw!";
    alert(winnertxt);
    gameInfo.innerHTML = `Round: ${currentRound}/${rounds}<br>
                              ${player1Name} Score: ${player1Score} (Rounds Won: ${player1RoundsWon})<br>
                              ${player2Name} Score: ${player2Score} (Rounds Won: ${player2RoundsWon})<br>
                              ${winnertxt}`;
    rollButton.textContent = "Restart Game";
    currentRound--;
}

function refreshPage() {
    location.reload();
}

function performPreGameRoll() {
    let roll = rollDice();
    diceDisplay.innerHTML += `${currentPlayer === 1 ? originalPlayerNames.player1 : originalPlayerNames.player2} rolled: ${roll}<br>`;
    preGameRolls[currentPlayer === 1 ? 'player1' : 'player2'] = roll;
    if (currentPlayer === 1) {
        currentPlayer = 2;
        diceDisplay.innerHTML += `Pre-game Roll - ${originalPlayerNames.player2}'s Turn<br>`;
    } else {
        determineFirstPlayer();
    }
}

function determineFirstPlayer() {
    if (preGameRolls.player1 > preGameRolls.player2) {
        player1Name = originalPlayerNames.player1;
        player2Name = originalPlayerNames.player2;
        startGame();
    } else if (preGameRolls.player2 > preGameRolls.player1) {
        player1Name = originalPlayerNames.player2;
        player2Name = originalPlayerNames.player1;
        startGame();
    } else {
        diceDisplay.innerHTML += `It's a tie! Re-rolling...<br>`;
        currentPlayer = 1;
    }
}

function startGame() {
    inPreGameRoll = false;
    currentPlayer = 1;
    currentRound = 1;
    rollCount = 0;
    rollButton.textContent = "Start Rounds";
    gameInfo.innerHTML = ""; 
    startNewRound();
}
