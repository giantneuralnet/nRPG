const menuOverlay = document.getElementById("menuOverlay");
const menuTitle = document.getElementById("menuTitle");
const menuSubtitle = document.getElementById("menuSubtitle");
const choicesLabel = document.getElementById("choicesLabel");
const choiceDown = document.getElementById("choiceDown");
const choiceUp = document.getElementById("choiceUp");
const difficultyButtons = Array.from(document.querySelectorAll(".difficulty-button"));
const seedInput = document.getElementById("seedInput");
const seedClear = document.getElementById("seedClear");
const infoButton = document.getElementById("infoButton");
const infoOverlay = document.getElementById("infoOverlay");
const infoClose = document.getElementById("infoClose");
const infoList = document.getElementById("infoList");
const menuAction = document.getElementById("menuAction");

const itemInfo = [
  ["sword","Sword","Gain attack."],
  ["shield","Shield","Gain defense."],
  ["potion","Potion","Heal immediately."],
  ["poison","Poison","Add poison to your attacks."],
  ["powerPotion","Power potion","Temporary attack or defense boost."],
  ["regenPotion","Regen potion","Periodic healing over several ticks."],
  ["vampirePotion","Vampire potion","Gain life steal on attacks."],
  ["bomb","Bomb","Damages you and all monsters."],
  ["clearBomb","Clear bomb","Clears the room without kills and removes clouds."],
  ["randomBomb","Random bomb","Randomizes hero and monster HP."],
  ["weakenBomb","Weaken bomb","Lowers everyone’s attack."],
  ["strengthBomb","Strength bomb","Raises everyone’s attack."],
  ["cloudBomb","Cloud bomb","Creates huge white clouds."],
  ["poisonBomb","Poison bomb","Poisons all monsters and hurts you."],
  ["healBomb","Heal bomb","Heals you and monsters."],
  ["lightningBomb","Lightning bomb","Damages all monsters and you."],
  ["iceBomb","Ice bomb","Freezes monsters temporarily."],
  ["zombieBomb","Zombie bomb","Turns monsters into zombies."],
  ["stoneScroll","Stone scroll","Makes one monster permanently stone."],
  ["hauntedScroll","Curse scroll","Haunts monsters so they rise once as ghosts."],
  ["killRandomItem","Kill random","Kills a random monster or backfires on you."],
  ["healRandomItem","Heal random","Fully heals a random target."],
  ["flashBang","Flash bang","Blinds the screen and stops monster fights for 5 seconds."],
  ["exileItem","Exile","Queues current monsters to reappear later."],
  ["swapHealthItem","HP swap","Shuffles HP across you and current monsters."],
  ["chest","Chest","Opens a random reward."]
];

const monsterInfo = [
  ["ELITE","Elite","Stronger monster worth more XP."],
  ["SHLD","Shielded","Wood shield absorbs the next damage from any source."],
  ["ZOMB","Zombie","Fights other monsters and counters you."],
  ["GHOST","Ghost","A resurrected haunted monster."],
  ["HAUNT","Haunted","Rises as a ghost when killed."],
  ["STONE","Stone","Cannot move or take damage."],
  ["ICE","Frozen","Cannot counter while frozen."],
  ["PSN","Poisoned","Takes periodic poison damage."],
  ["DOOR","Door","Switches to one of the three remembered rooms."]
];

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

function addInfoTitle(text) {
  const title = document.createElement("h3");
  title.className = "info-section-title";
  title.textContent = text;
  infoList.appendChild(title);
}

function addInfoRow(icon, name, description, isItem = true) {
  const row = document.createElement("div");
  row.className = "info-row";

  if (isItem && icons[icon]) {
    const img = document.createElement("img");
    img.className = "info-icon";
    img.alt = "";
    img.src = icons[icon].toDataURL();
    row.appendChild(img);
  } else {
    const badge = document.createElement("div");
    badge.className = "info-badge";
    badge.textContent = isItem ? name.slice(0, 2).toUpperCase() : icon;
    row.appendChild(badge);
  }

  const copy = document.createElement("div");
  copy.className = "info-copy";
  copy.innerHTML = `<strong>${name}</strong><span>${description}</span>`;
  row.appendChild(copy);
  infoList.appendChild(row);
}

function buildInfoList() {
  addInfoTitle("Items");
  for (const item of itemInfo) addInfoRow(item[0], item[1], item[2], true);
  addInfoTitle("Monsters and rooms");
  for (const monster of monsterInfo) addInfoRow(monster[0], monster[1], monster[2], false);
}

choiceDown.addEventListener("click", () => {
  settings.choices = Math.max(1, settings.choices - 1);
  updateMenuOverlay();
});

choiceUp.addEventListener("click", () => {
  settings.choices = Math.min(9, settings.choices + 1);
  updateMenuOverlay();
});

seedClear.addEventListener("click", () => {
  seedInput.value = "";
  updateSeedPlaceholder();
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
buildInfoList();
updateMenuOverlay();
