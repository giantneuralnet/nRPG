const menuOverlay = document.getElementById("menuOverlay");
const menuTitle = document.getElementById("menuTitle");
const menuSubtitle = document.getElementById("menuSubtitle");
const choicesLabel = document.getElementById("choicesLabel");
const choiceDown = document.getElementById("choiceDown");
const choiceUp = document.getElementById("choiceUp");
const difficultyButtons = Array.from(document.querySelectorAll(".difficulty-button"));
const seedInput = document.getElementById("seedInput");
const infoButton = document.getElementById("infoButton");
const infoOverlay = document.getElementById("infoOverlay");
const infoClose = document.getElementById("infoClose");
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
    menuSubtitle.textContent = `Seed ${activeSeed}`;
    menuAction.textContent = "RESET";
  } else if (gameState === "win") {
    menuTitle.textContent = "YOU WIN!";
    menuSubtitle.textContent = `Seed ${activeSeed}`;
    menuAction.textContent = "PLAY AGAIN";
  } else {
    menuTitle.textContent = "DROP RPG";
    menuSubtitle.textContent = "Swords, shields, potions, bombs, elites, ice, zombies, clouds, and curses.";
    menuAction.textContent = "START";
  }

  choicesLabel.textContent = `N = number of choices: ${settings.choices}`;
  seedInput.placeholder = `${currentSeed}`;
  choiceDown.disabled = settings.choices <= 1;
  choiceUp.disabled = settings.choices >= 9;

  for (const button of difficultyButtons) {
    button.classList.toggle("is-selected", button.dataset.difficulty === settings.difficulty);
  }
}

function updateSeedPlaceholder() {
  refreshCurrentSeed();
  if (!seedInput.value.trim()) {
    seedInput.placeholder = `${currentSeed}`;
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

infoButton.addEventListener("click", () => {
  infoOverlay.classList.add("is-visible");
  infoOverlay.setAttribute("aria-hidden", "false");
});

infoClose.addEventListener("click", () => {
  infoOverlay.classList.remove("is-visible");
  infoOverlay.setAttribute("aria-hidden", "true");
});

menuAction.addEventListener("click", () => {
  resumeAudio();

  if (gameState === "menu") {
    const typedSeed = seedInput.value.trim();
    settings.seed = typedSeed ? normalizeSeed(typedSeed) : currentSeed;
    resetGame();
  } else if (gameState === "dead" || gameState === "win") {
    gameState = "menu";
  }

  updateMenuOverlay();
});

setInterval(updateSeedPlaceholder, 1000);
updateMenuOverlay();
