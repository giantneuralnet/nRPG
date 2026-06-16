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
  ["moltenPotion","Molten","Attacks create lava pools under enemies."],
  ["dodgePotion","Dodge","Gain a chance to avoid incoming damage."],
  ["critPotion","Crit","Gain a chance to deal double attack damage."],
  ["surprisePotion","Surprise strike","Deal bonus damage to full-health monsters."],
  ["decayCurse","Decay","Take damage every second and gain poison every tick."],
  ["phoenixPotion","Phoenix","Revive at 1 HP instead of dying."],
  ["confusionCurse","Confused","Attacks hit random enemies and can hit you."],
  ["glitchCurse","Glitched","Swaps all entity positions every .5-1 second."],
  ["luckyCharm","Lucky","Makes helpful entities more likely to spawn."],
  ["unluckyCurse","Unlucky","Makes item drops less common."],
  ["gunpowder","Gunpowder","Increases bomb damage."],
  ["multiplyStatus","Multiply","Increases the value of future item pickups."],
  ["triggerStatus","Trigger","Makes future items trigger extra times."],
  ["maxHealthUp","Max health up","Increases your maximum health."],
  ["maxHealthDown","Max health down","Decreases your maximum health."],
  ["prayerBook","Prayer book","Choose one item to be the only item that spawns."],
  ["banishBook","Banish book","Choose one item to stop from spawning."],
  ["bomb","Bomb","Damages you and all monsters."],
  ["clearBomb","Clear bomb","Clears the room without kills and removes clouds."],
  ["cleanBomb","Clean bomb","Removes status effects from you and monsters."],
  ["randomBomb","Random bomb","Randomizes hero and monster HP."],
  ["weakenBomb","Weaken bomb","Lowers everyone’s attack."],
  ["strengthBomb","Strength bomb","Raises everyone’s attack."],
  ["cloudBomb","Cloud bomb","Grays the screen until tapped 3-9 times."],
  ["poisonBomb","Poison bomb","Poisons all monsters and hurts you."],
  ["fireBomb","Fire bomb","Sets monsters on fire for damage over time."],
  ["lavaBomb","Lava bomb","Drops long-lasting lava pools that add fire."],
  ["contagionBomb","Contagion bomb","Makes monsters copy their statuses to all other monsters when killed."],
  ["echoBomb","Shockwave bomb","Makes enemies emit damaging shockwaves during counterattacks."],
  ["soulBomb","Soul connection bomb","Links two monsters so they split incoming damage."],
  ["healBomb","Heal bomb","Heals you and monsters."],
  ["lightningBomb","Lightning bomb","Damages all monsters and you."],
  ["iceBomb","Ice bomb","Freezes monsters temporarily."],
  ["zombieScroll","Zombie scroll","Turns one monster into a zombie."],
  ["shieldBomb","Shield all bomb","Gives every current monster a fresh shield."],
  ["stoneBomb","Stone bomb","Turns every current monster into stone."],
  ["nukeBomb","Nuke","Nukes everything."],
  ["enrageBomb","Enrage bomb","Makes monsters attack nearby targets and turn red."],
  ["blindBomb","Blind bomb","Blinds monsters so counters hit random targets."],
  ["stoneScroll","Stone scroll","Makes one monster permanently stone."],
  ["hauntedScroll","Curse scroll","Haunts monsters so they rise once as ghosts."],
  ["blessedScroll","Blessed curse","Heals you when you kill a monster."],
  ["allyScroll","Ally scroll","Makes a random monster your ally."],
  ["combustionScroll","Combustion scroll","Starts a 10 second countdown on a monster, then it explodes for its attack."],
  ["killRandomItem","Kill random","Kills a random monster or backfires on you."],
  ["healRandomItem","Heal random","Fully heals a random target."],
  ["flashBang","Flash bang","Blinds the screen and stops monster fights for 5 seconds."],
  ["exileItem","Exile","Queues current monsters to reappear later."],
  ["swapHealthItem","HP swap","Shuffles HP across you and current monsters."],
  ["chest","Chest","Opens a random reward."]
];

const goodBookItems = new Set([
  "sword","shield","potion","poison","powerPotion","regenPotion","vampirePotion","moltenPotion","dodgePotion","critPotion","surprisePotion",
  "phoenixPotion","luckyCharm","gunpowder","multiplyStatus","triggerStatus","maxHealthUp","prayerBook","banishBook","clearBomb","cleanBomb",
  "healBomb","iceBomb","shieldBomb","stoneBomb","stoneScroll","allyScroll","killRandomItem","healRandomItem","exileItem","chest"
]);
let nextBookBlessed = true;

const monsterInfo = [
  ["normal","Monster","Random monster that attacks back."],
  ["elite","Elite","Stronger monster worth more XP."],
  ["ultraElite","Ultra elite","Much stronger monster worth more XP."],
  ["shielded","Shielded","Wood shield absorbs the next damage from any source."],
  ["zombie","Zombie","Fights other monsters and counters you."],
  ["ghostZombie","Ghost zombie","Transparent zombie resurrected by a haunt."],
  ["haunted","Haunted","Purple eyes; rises as a ghost when killed."],
  ["contagious","Contagious","Copies statuses, including ally, to all other monsters when killed."],
  ["echo","Shockwave","Counterattacks emit a radius that can trigger more shockwaves."],
  ["combustion","Combustion","Orange eyes and a countdown; explodes for attack value at zero."],
  ["stone","Stone","Cannot move or take damage."],
  ["burning","Burning","Takes periodic fire damage."],
  ["blind","Blind","Closed eyes; counters random targets."],
  ["rage","Rage","Turns red and attacks nearby monsters."],
  ["frozen","Frozen","Cannot counter while frozen."],
  ["poisoned","Poisoned","Takes periodic poison damage."],
  ["ally","Ally","Smiling monster that attacks the monster you target."],
  ["door","Door","Switches to one of the four remembered rooms."]
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
    hp:10,maxHp:10,atk:1,poison:0,fire:0,stone:false,frozenUntil:0,
    team:kind === "ally" ? "hero" : "enemy",
    elite:kind === "elite" || kind === "ultraElite",
    ultraElite:kind === "ultraElite",
    shielded:kind === "shielded",
    shieldBroken:false,
    zombie:kind === "zombie" || kind === "ghostZombie",
    ghost:kind === "ghostZombie",
    haunted:kind === "haunted",
    contagious:kind === "contagious",
    echoDamage:kind === "echo",
    combustAt:kind === "combustion" ? performance.now() + 10000 : 0,
    blind:kind === "blind",
    rage:kind === "rage",
    attacking:false,
    parts:{
      color:kind === "zombie" || kind === "ghostZombie" ? "#6cff6c" : "#ff7070",
      head:kind === "stone" ? "box" : "circle",
      eyes:2,
      mouth:kind === "ally" ? "smile" : kind === "zombie" || kind === "ghostZombie" ? "void" : "fangs",
      horns:kind === "elite",
      legs:2,
      arms:2
    }
  };
  if (kind === "stone") m.stone = true;
  if (kind === "frozen") m.frozenUntil = performance.now() + 10000;
  if (kind === "poisoned") m.poison = 12;
  if (kind === "burning") m.fire = 12;
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
  if (m.contagious) {
    g.save();
    g.strokeStyle = "#57ff75";
    g.lineWidth = 4;
    g.setLineDash([8, 7]);
    g.beginPath();
    g.arc(50,50,m.r * 1.14,0,Math.PI*2);
    g.stroke();
    g.restore();
  }
  if (m.echoDamage) {
    g.save();
    g.strokeStyle = "#72dfff";
    g.lineWidth = 4;
    g.beginPath();
    g.arc(50,50,m.r * 1.28,0,Math.PI*2);
    g.stroke();
    g.restore();
  }
  if (!icons.monsterShield && typeof makeIcon === "function") icons.monsterShield = makeIcon("monsterShield");
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

function sampleBookItems(mode, blessed, count = 3) {
  const wantsGood = mode === "prayer" ? blessed : !blessed;
  let pool = itemInfo.filter(([kind]) => goodBookItems.has(kind) === wantsGood);
  if (pool.length < count) pool = itemInfo.slice();
  const sample = [];
  while (pool.length && sample.length < count) {
    const index = Math.floor(rng() * pool.length);
    sample.push(pool.splice(index,1)[0]);
  }
  return sample;
}

function openItemBook(mode) {
  const blessed = nextBookBlessed;
  nextBookBlessed = !nextBookBlessed;
  const prefix = blessed ? "Blessed" : "Cursed";
  const overlay = document.createElement("div");
  overlay.className = `book-overlay is-visible book-${mode}`;
  const panel = document.createElement("div");
  panel.className = "book-panel";
  const title = document.createElement("h2");
  title.textContent = mode === "prayer" ? `${prefix} Prayer Book` : `${prefix} Banish Book`;
  panel.appendChild(title);
  const prompt = document.createElement("div");
  prompt.className = "book-prompt";
  prompt.textContent = mode === "prayer" ? "Pray for this item:" : "Item to banish:";
  panel.appendChild(prompt);

  const grid = document.createElement("div");
  grid.className = "book-grid book-triangle";
  let selected = null;
  let selectedName = "";
  const confirm = document.createElement("button");
  confirm.className = "book-confirm";
  confirm.type = "button";
  confirm.textContent = mode === "prayer" ? "PRAY" : "BANISH";
  confirm.disabled = true;

  for (const [kind,name] of sampleBookItems(mode, blessed)) {
    if (!icons[kind] && typeof makeIcon === "function") icons[kind] = makeIcon(kind);
    const button = document.createElement("button");
    button.className = "book-choice";
    button.type = "button";
    if (icons[kind]) {
      const img = document.createElement("img");
      img.alt = "";
      img.src = icons[kind].toDataURL();
      button.appendChild(img);
    }
    const span = document.createElement("span");
    span.textContent = name;
    button.appendChild(span);
    button.addEventListener("click", () => {
      selected = kind;
      selectedName = name;
      for (const choice of grid.querySelectorAll(".book-choice")) {
        choice.classList.toggle("is-selected", choice === button);
      }
      confirm.disabled = false;
    });
    grid.appendChild(button);
  }
  panel.appendChild(grid);

  confirm.addEventListener("click", () => {
    if (!selected) return;
    if (mode === "prayer") {
      hero.prayerKind = selected;
      hero.prayerRemaining = 13;
      flash = `${selectedName} prayed`;
    } else {
      if (!hero.banishedItems.includes(selected)) hero.banishedItems.push(selected);
      if (hero.prayerKind === selected) hero.prayerKind = null;
      if (hero.prayerKind === null) hero.prayerRemaining = 0;
      flash = `${selectedName} banished`;
    }
    overlay.remove();
  });
  panel.appendChild(confirm);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
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
