// getting number of rounds
let rounds = prompt("Enter an odd number of rounds:")
while(rounds%2 == 0) {
    rounds = prompt("Enter an ODD number of rounds (ODD):")
}

// button check
document.querySelector(".start_button").addEventListener("click", function () {
    alert("game start")
});