let answer;
let turns = 0;
const maxTurns = 6;

const board = document.getElementById("board");
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");

guessBtn.onclick = submitGuess;

// Get list and mode from HTML
const gameList = window.list;
const gameMode = window.mode;

loadCharacters();

function loadCharacters() {
    let script = document.createElement("script");
    script.src = gameList;
    script.onload = startGame;
    document.body.appendChild(script);
}

function startGame() {
    if (gameMode === "random") {
        answer = characters[Math.floor(Math.random() * characters.length)];
    }

    if (gameMode === "daily") {
        let day = Math.floor(Date.now() / 86400000);
        if (localStorage.getItem(gameList + "_daily") == day) {
            alert("You already played today's daily.");
            window.location = "index.html";
            return;
        }
        answer = characters[day % characters.length];
    }

    console.log("Answer:", answer);
}

function submitGuess() {
    if (turns >= maxTurns) return;

    let name = guessInput.value.trim().toUpperCase();
    let guess = characters.find(c => c.name === name);

    if (!guess) {
        alert("Invalid character");
        return;
    }

    turns++;
    displayGuess(guess);

    if (guess.name === answer.name) {
        endGame(true);
        return;
    }

    if (turns >= maxTurns) {
        endGame(false);
    }

    guessInput.value = "";
}

function displayGuess(guess) {
    let row = document.createElement("div");
    row.className = "row";

    const keys = Object.keys(guess);

    keys.forEach(key => {
        if (key === "name") {
            row.appendChild(makeCell(guess.name, guess.name === answer.name));
        } else if (key === "lightner" || key === "species") {
            row.appendChild(makeCell(guess[key], guess[key] === answer[key]));
        } else if (key === "chapter" || key === "place") {
            row.appendChild(compareNumber(key, guess[key]));
        } else if (key === "role") {
            row.appendChild(compareRole(guess.role));
        } else if (key === "gender") {
            row.appendChild(makeCell(guess.gender, guess.gender === answer.gender));
        } else if (key === "undertale" || key === "deltarune") {
            row.appendChild(makeCell(guess[key] ? "Yes" : "No", guess[key] === answer[key]));
        }
    });

    board.appendChild(row);
}

function compareNumber(key, value) {
    let correctText = key === "chapter" ? "Chapter " + value : "Place " + value;

    if (value === answer[key]) return makeCell(correctText, true);
    if (value < answer[key]) return makeCell(correctText + " ↑", "close");
    return makeCell(correctText + " ↓", "close");
}

function compareRole(roles) {
    let correct = roles.length === answer.role.length &&
                  roles.every(r => answer.role.includes(r));

    if (correct) return makeCell(roles.join(","), true);

    let partial = roles.some(r => answer.role.includes(r));
    if (partial) return makeCell(roles.join(","), "close");

    return makeCell(roles.join(","), false);
}

function makeCell(text, state) {
    let cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = text;

    if (state === true) cell.classList.add("correct");
    if (state === "close") cell.classList.add("close");
    if (state === false) cell.classList.add("wrong");

    return cell;
}

function endGame(win) {
    document.getElementById("resultText").innerText = win ? "You Win!" : "You Lost!";
    document.getElementById("answerText").innerText = "Answer: " + answer.name;

    if (gameMode === "daily") {
        let day = Math.floor(Date.now() / 86400000);
        localStorage.setItem(gameList + "_daily", day);
    }

    document.getElementById("resultMenu").style.display = "block";
}

function playAgain() {
    window.location.href = window.location.href; // reloads current page
}
