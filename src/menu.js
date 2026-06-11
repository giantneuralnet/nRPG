const menuOverlay = document.getElementById("menuOverlay");
const menuTitle = document.getElementById("menuTitle");
const menuSubtitle = document.getElementById("menuSubtitle");
const choicesLabel = document.getElementById("choicesLabel");
const choiceDown = document.getElementById("choiceDown");
const choiceUp = document.getElementById("choiceUp");
const difficultyButtons = Array.from(document.querySelectorAll(".difficulty-button"));
const menuAction = document.getElementById("menuAction");

function resumeAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function updateMenuOverlay() {
  const visible = gameState === "menu" || gameState === "dead" || gameState === "win";
  menuOverlay.classList.toggle("is-visible", visible);
  if (!visible) return;

  if (gameState === "dead") {
    menuTitle.textContent = "YOU DIED";
    menuSubtitle.textContent = "Bombs can hurt you too.";
    menuAction.textContent = "RESET";
  } else if (gameState === "win") {
    menuTitle.textContent = "YOU WIN!";
    menuSubtitle.textContent = "You defeated 20 monsters.";
    menuAction.textContent = "PLAY AGAIN";
  } else {
    menuTitle.textContent = "DROP RPG";
    menuSubtitle.textContent = "Swords, shields, potions, bombs, elites, ice, zombies, clouds, and curses.";
    menuAction.textContent = "START";
  }

  choicesLabel.textContent = `N = number of choices: ${settings.choices}`;
  choiceDown.disabled = settings.choices <= 1;
  choiceUp.disabled = settings.choices >= 9;

  for (const button of difficultyButtons) {
    button.classList.toggle("is-selected", button.dataset.difficulty === settings.difficulty);
  }
}

choiceDown.addEventListener("click", () => {
  settings.choices = Math.max(1, settings.choices - 1);
  updateMenuOverlay();
});

choiceUp.addEventListener("click", () => {
  settings.choices = Math.min(9, settings.choices + 1);
  updateMenuOverlay();
});

for (const button of difficultyButtons) {
  button.addEventListener("click", () => {
    settings.difficulty = button.dataset.difficulty;
    updateMenuOverlay();
  });
}

menuAction.addEventListener("click", () => {
  resumeAudio();

  if (gameState === "menu") {
    resetGame();
  } else if (gameState === "dead" || gameState === "win") {
    gameState = "menu";
  }

  updateMenuOverlay();
});

updateMenuOverlay();
