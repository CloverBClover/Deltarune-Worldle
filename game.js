document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const guessInput = document.getElementById("guess-input");
  const guessBtn = document.getElementById("guess-btn");
  const resultMenu = document.getElementById("resultMenu");
  const resultText = document.getElementById("resultText");
  const answerText = document.getElementById("answerText");

  let answer;
  let turns = 0;
  const maxTurns = 6;

  // pick random answer
  answer = window.characters[Math.floor(Math.random() * window.characters.length)];
  console.log("Answer:", answer);

  // enable button
  guessBtn.disabled = false;

  // click or enter
  guessBtn.onclick = submitGuess;
  guessInput.addEventListener("keydown", e => {
    if (e.key === "Enter") submitGuess();
  });

  function submitGuess() {
    if (turns >= maxTurns) return;

    const name = guessInput.value.trim().toUpperCase();
    const guess = window.characters.find(c => c.name.toUpperCase() === name);

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

    if (turns >= maxTurns) endGame(false);
    guessInput.value = "";
  }

  function displayGuess(guess) {
    const row = document.createElement("div");
    row.className = "row";

    row.appendChild(makeCell(guess.name, guess.name === answer.name));
    row.appendChild(makeCell(guess.lightner, guess.lightner === answer.lightner));
    row.appendChild(compareNumber("chapter", guess.chapter));
    row.appendChild(compareRole(guess.role));
    row.appendChild(makeCell(guess.gender, guess.gender === answer.gender));
    row.appendChild(makeCell(guess.undertale ? "Yes" : "No", guess.undertale === answer.undertale));

    board.appendChild(row);
  }

  function compareNumber(key, value) {
    const text = key === "chapter" ? "Chapter " + value : "Place " + value;
    if (value === answer[key]) return makeCell(text, true);
    if (value < answer[key]) return makeCell(text + " ↑", "close");
    return makeCell(text + " ↓", "close");
  }

  function compareRole(roles) {
    const correct = roles.length === answer.role.length && roles.every(r => answer.role.includes(r));
    if (correct) return makeCell(roles.join(","), true);
    const partial = roles.some(r => answer.role.includes(r));
    if (partial) return makeCell(roles.join(","), "close");
    return makeCell(roles.join(","), false);
  }

  function makeCell(text, state) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = text;
    if (state === true) cell.classList.add("correct");
    if (state === "close") cell.classList.add("close");
    if (state === false) cell.classList.add("wrong");
    return cell;
  }

  function endGame(win) {
    resultText.innerText = win ? "You Win!" : "You Lost!";
    answerText.innerText = "Answer: " + answer.name;
    resultMenu.style.display = "block";
  }

  window.playAgain = () => {
    window.location.reload();
  };
});
