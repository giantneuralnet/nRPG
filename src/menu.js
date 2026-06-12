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
  ["shieldBomb","Shield all bomb","Gives every current monster a fresh shield."],
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
  ["normal","Monster","Random monster that attacks back."],
  ["elite","Elite","Stronger monster worth more XP."],
  ["shielded","Shielded","Wood shield absorbs the next damage from any source."],
  ["zombie","Zombie","Fights other monsters and counters you."],
  ["ghostZombie","Ghost zombie","Transparent zombie resurrected by a haunt."],
  ["haunted","Haunted","Purple border; rises as a ghost when killed."],
  ["stone","Stone","Cannot move or take damage."],
  ["frozen","Frozen","Cannot counter while frozen."],
  ["poisoned","Poisoned","Takes periodic poison damage."],
  ["door","Door","Switches to one of the three remembered rooms."]
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

  if (isItem && !icons[icon] && typeof makeIcon === "function") {
    icons[icon] = makeIcon(icon);
  }

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

function infoMonster(kind) {
  const m = {
    type:"monster",
    x:50,y:50,targetY:50,r:26,
    hp:10,maxHp:10,atk:1,poison:0,stone:false,frozenUntil:0,
    elite:kind === "elite",
    shielded:kind === "shielded",
    shieldBroken:false,
    zombie:kind === "zombie" || kind === "ghostZombie",
    ghost:kind === "ghostZombie",
    haunted:kind === "haunted",
    attacking:false,
    parts:{
      color:kind === "zombie" || kind === "ghostZombie" ? "#6cff6c" : "#ff7070",
      head:kind === "stone" ? "box" : "circle",
      eyes:2,
      mouth:kind === "zombie" || kind === "ghostZombie" ? "void" : "fangs",
      horns:kind === "elite",
      legs:2,
      arms:2
    }
  };
  if (kind === "stone") m.stone = true;
  if (kind === "frozen") m.frozenUntil = performance.now() + 10000;
  if (kind === "poisoned") m.poison = 12;
  return m;
}

function makeMonsterInfoIcon(kind) {
  const c = document.createElement("canvas");
  c.width = c.height = 100;
  const g = c.getContext("2d");
  if (kind === "door") {
    drawDoorOn(g, { x:50, y:48, r:24, room:2 });
    return c;
  }

  const m = infoMonster(kind);
  drawMonsterBodyOn(g, m, 50, 50, m.r, 0);
  if (m.haunted) {
    g.strokeStyle = "#b987ff";
    g.lineWidth = 5;
    g.beginPath();
    g.arc(50,50,m.r*1.35,0,Math.PI*2);
    g.stroke();
  }
  if (m.shielded && !m.shieldBroken && icons.monsterShield) {
    const shieldSize = m.r * 1.55;
    g.drawImage(icons.monsterShield, 50 + m.r * .45 - shieldSize * .5, 50 - shieldSize * .25, shieldSize, shieldSize);
  }
  return c;
}

function buildInfoList() {
  addInfoTitle("Items");
  for (const item of itemInfo) addInfoRow(item[0], item[1], item[2], true);
  addInfoTitle("Monsters and rooms");
  for (const monster of monsterInfo) {
    try {
      const icon = makeMonsterInfoIcon(monster[0]);
      icons[`info_${monster[0]}`] = icon;
      addInfoRow(`info_${monster[0]}`, monster[1], monster[2], true);
    } catch {
      addInfoRow(monster[0].slice(0, 4).toUpperCase(), monster[1], monster[2], false);
    }
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
