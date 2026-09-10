const menuOverlay = document.getElementById("menuOverlay");
const menuTitle = document.getElementById("menuTitle");
const menuSubtitle = document.getElementById("menuSubtitle");
const choicesLabel = document.getElementById("choicesLabel");
const choiceDown = document.getElementById("choiceDown");
const choiceUp = document.getElementById("choiceUp");
const difficultyButtons = Array.from(document.querySelectorAll(".difficulty-button"));
const languageLabel = document.getElementById("languageLabel");
const languageButtons = Array.from(document.querySelectorAll(".language-button"));
const seedLabel = document.getElementById("seedLabel");
const seedInput = document.getElementById("seedInput");
const seedClear = document.getElementById("seedClear");
const infoButton = document.getElementById("infoButton");
const infoOverlay = document.getElementById("infoOverlay");
const infoClose = document.getElementById("infoClose");
const infoTitle = document.getElementById("infoTitle");
const infoList = document.getElementById("infoList");
const menuAction = document.getElementById("menuAction");
const audioToggle = document.getElementById("audioToggle");

const menuText = {
  en: {
    title: "DROP RPG",
    subtitle: "Swords, shields, potions, bombs, elites, ice, zombies, clouds, and curses.",
    dead: "YOU DIED",
    win: "YOU WIN!",
    reset: "RESET",
    playAgain: "PLAY AGAIN",
    start: "START",
    info: "INFO",
    close: "CLOSE",
    choices: "N = number of choices",
    difficulty: "Difficulty",
    difficulties: { easy: "easy", normal: "normal", hard: "hard" },
    language: "Language",
    seed: "Seed",
    seedTime: "Seed {seed}  Time {time}"
  },
  ja: {
    title: "ドロップRPG",
    subtitle: "剣、盾、ポーション、爆弾、エリート、氷、ゾンビ、雲、呪い。",
    dead: "ゲームオーバー",
    win: "勝利!",
    reset: "リセット",
    playAgain: "もう一度",
    start: "スタート",
    info: "情報",
    close: "閉じる",
    choices: "選択肢の数",
    difficulty: "難易度",
    difficulties: { easy: "かんたん", normal: "普通", hard: "むずかしい" },
    language: "言語",
    seed: "シード",
    seedTime: "シード {seed}  タイム {time}"
  }
};

function t() {
  return menuText[settings.language] || menuText.en;
}

const itemJa = {
  sword:["剣","攻撃力を上げる。"], shield:["防御","防御力を上げる。"], potion:["ポーション","すぐに回復する。"], poison:["毒","攻撃に毒を付与する。"],
  powerPotion:["パワーポーション","一時的に攻撃力か防御力を上げる。"], regenPotion:["再生ポーション","数秒間、定期的に回復する。"], vampirePotion:["吸血ポーション","攻撃時に体力を吸収する。"],
  moltenPotion:["溶岩化","攻撃時に敵の下へ溶岩を作る。"], dodgePotion:["回避","受けるダメージを避ける確率を得る。"], critPotion:["会心","2倍ダメージの確率を得る。"],
  surprisePotion:["奇襲","体力満タンの敵に追加ダメージ。"], decayCurse:["腐敗","毎秒ダメージを受け、毒も増える。"], phoenixPotion:["不死鳥","死ぬ代わりにHP1で復活する。"],
  confusionCurse:["混乱","攻撃がランダム対象になり、自分に当たることもある。"], glitchCurse:["グリッチ","全エンティティの位置を0.5-1秒ごとに入れ替える。"], luckyCharm:["幸運","有利な出現が増えやすくなる。"],
  unluckyCurse:["不運","アイテム出現が少なくなる。"], gunpowder:["火薬","爆弾ダメージを上げる。"], multiplyStatus:["倍率","今後のアイテム効果を強くする。"], triggerStatus:["連鎖","今後のアイテムを追加発動する。"],
  maxHealthUp:["最大HP上昇","最大HPを上げる。"], maxHealthDown:["最大HP低下","最大HPを下げる。"], prayerBook:["祈りの本","選んだアイテムだけが出るようにする。"], banishBook:["追放の本","選んだアイテムを出現しないようにする。"],
  bomb:["爆弾","自分と全モンスターにダメージ。"], clearBomb:["クリア爆弾","キルなしで部屋を消し、雲を消す。"], cleanBomb:["浄化爆弾","自分とモンスターの状態異常を消す。"], randomBomb:["ランダム爆弾","自分とモンスターのHPをランダム化する。"],
  weakenBomb:["弱体爆弾","全員の攻撃力を下げる。"], strengthBomb:["強化爆弾","全員の攻撃力を上げる。"], cloudBomb:["雲爆弾","画面を3-9回タップまで灰色にする。"], poisonBomb:["毒爆弾","全モンスターを毒にし、自分も傷つく。"],
  fireBomb:["火炎爆弾","モンスターを燃やして継続ダメージ。"], lavaBomb:["溶岩爆弾","火を付与する長持ち溶岩を作る。"], contagionBomb:["感染爆弾","死亡時に状態を他のモンスターへコピーする。"], echoBomb:["衝撃波爆弾","反撃時に連鎖する衝撃波を出す。"],
  soulBomb:["魂リンク爆弾","2体のモンスターが受けるダメージを分ける。"], healBomb:["回復爆弾","自分とモンスターを回復する。"], lightningBomb:["帯電爆弾","モンスターに帯電を付与する。"], iceBomb:["氷爆弾","モンスターを一時的に凍らせる。"],
  zombieScroll:["ゾンビ巻物","モンスター1体をゾンビにする。"], shieldBomb:["盾爆弾","自分とモンスターに茶色の盾を付与する。"], stoneBomb:["石化爆弾","全モンスターを石化する。"], nukeBomb:["核爆弾","すべてを吹き飛ばす。"],
  enrageBomb:["激怒爆弾","モンスターを赤くし、近くを攻撃させる。"], blindBomb:["盲目爆弾","モンスターを盲目にし、反撃対象をランダムにする。"], stoneScroll:["石化巻物","モンスター1体を永久に石化する。"], hauntedScroll:["呪い巻物","モンスターを呪い、死後にゴースト化させる。"],
  blessedScroll:["祝福の呪い","モンスターを倒すと回復する。"], necroticScroll:["死霊の祝福","死亡時に防御を得る。"], allyScroll:["味方巻物","ランダムなモンスターを味方にする。"], combustionScroll:["自然発火巻物","10秒後に攻撃力分の火炎を毎秒放つ。"],
  killRandomItem:["ランダムキル","ランダムなモンスターを倒すか、自分に跳ね返る。"], healRandomItem:["ランダム回復","ランダム対象を全回復する。"], flashBang:["閃光弾","画面を白くし、5秒間モンスター戦闘を止める。"], exileItem:["追放","現在のモンスターを後で再出現するキューへ送る。"],
  swapHealthItem:["HP交換","自分とモンスターのHPをシャッフルする。"], chest:["宝箱","ランダム報酬を開く。"]
};

const monsterJa = {
  normal:["モンスター","反撃する通常モンスター。"], elite:["エリート","より強く、XPも多い。"], ultraElite:["超エリート","さらに強く、XPも多い。"], shielded:["盾持ち","木の盾が次のダメージを吸収する。"],
  zombie:["ゾンビ","他のモンスターと戦い、自分にも反撃する。"], ghostZombie:["ゴーストゾンビ","呪いで復活した透明なゾンビ。"], haunted:["呪われた","紫の目。倒すと一度ゴーストになる。"], contagious:["感染","死亡時に味方を含む状態を他へコピーする。"],
  echo:["衝撃波","反撃時に連鎖する範囲攻撃を出す。"], charge:["帯電","毎秒いちばん近い相手を感電させ、帯電を広げる。"], combustion:["自然発火","炎色に点滅し、カウント後に毎秒ダメージ。"], stone:["石化","動けず、ダメージを受けない。"],
  burning:["炎上","定期的に火ダメージを受ける。"], blind:["盲目","目を閉じ、反撃対象がランダム。"], rage:["激怒","赤くなり、近くのモンスターを攻撃する。"], frozen:["凍結","凍っている間は反撃できない。"],
  poisoned:["毒","定期的に毒ダメージを受ける。"], ally:["味方","笑顔のモンスター。あなたが狙った敵を攻撃する。"], door:["ドア","記憶された4部屋のどれかへ移動する。"]
};

const gameplayJa = {
  room:"部屋", kills:"撃破", boss:"ボス", lv:"LV", xp:"XP", atk:"攻", def:"防", hp:"HP", time:"時間",
  tapStart:"モンスターとアイテムをタップ", tapClouds:"雲を消すにはタップ", roomFlash:"部屋 {room}",
  statuses:{ POISON:"毒", VAMP:"吸血", REGEN:"再生", "ATK UP":"攻撃UP", "DEF UP":"防御UP", BLESSED:"祝福", NECROTIC:"死霊", MOLTEN:"溶岩", DODGE:"回避", CRIT:"会心", SURPRISE:"奇襲", DECAY:"腐敗", PHOENIX:"不死鳥", CONFUSED:"混乱", GLITCHED:"グリッチ", LUCKY:"幸運", UNLUCKY:"不運", GUNPOWDER:"火薬", MULTIPLY:"倍率", TRIGGER:"連鎖", SHIELD:"盾", CHARGE:"帯電", RAGE:"激怒", Prayer:"祈り" },
  monster:{ BOSS:"ボス", ALLY:"味方", STONE:"石化", COMBUST:"発火", BURN:"燃焼", RAGE:"激怒", BLIND:"盲目", CONTAGIOUS:"感染", SHOCK:"衝撃", CHARGE:"帯電", SHIELDED:"盾", GHOST:"ゴースト", HAUNTED:"呪い", ZOMBIE:"ゾンビ", ULTRA:"超", ELITE:"エリート", ATK:"攻" },
  item:{ sword:"攻撃", shield:"防御", potion:"HP", regenPotion:"再生", vampirePotion:"吸血", moltenPotion:"溶岩", dodgePotion:"回避", critPotion:"会心", surprisePotion:"奇襲", decayCurse:"腐敗", phoenixPotion:"不死鳥", confusionCurse:"混乱", glitchCurse:"グリッチ", luckyCharm:"幸運", unluckyCurse:"不運", gunpowder:"火薬", multiplyStatus:"倍率", triggerStatus:"連鎖", maxHealthUp:"最大HP", maxHealthDown:"最大HP", prayerBook:"祈り", banishBook:"追放", powerPotion:"強化", poison:"毒", bomb:"爆弾", clearBomb:"クリア爆弾", cleanBomb:"浄化爆弾", randomBomb:"ランダム爆弾", weakenBomb:"弱体", strengthBomb:"強化", cloudBomb:"雲爆弾", lightningBomb:"帯電", poisonBomb:"毒爆弾", fireBomb:"火炎爆弾", lavaBomb:"溶岩爆弾", contagionBomb:"感染", echoBomb:"衝撃波", soulBomb:"魂リンク", healBomb:"回復爆弾", iceBomb:"氷爆弾", zombieScroll:"ゾンビ巻物", shieldBomb:"盾爆弾", stoneBomb:"石化爆弾", nukeBomb:"核爆弾", enrageBomb:"激怒", blindBomb:"盲目爆弾", stoneScroll:"石化巻物", hauntedScroll:"呪い巻物", blessedScroll:"祝福", necroticScroll:"死霊", allyScroll:"味方巻物", combustionScroll:"発火", killRandomItem:"ランダムキル", healRandomItem:"ランダム回復", flashBang:"閃光弾", exileItem:"追放", swapHealthItem:"HP交換", chest:"宝箱" }
};

function isJapanese() {
  return settings.language === "ja";
}

function localizeInfo(entry, map) {
  if (!isJapanese() || !map[entry[0]]) return entry;
  return [entry[0], map[entry[0]][0], map[entry[0]][1]];
}

function gameplayLabel(group, key) {
  if (!isJapanese()) return key;
  return gameplayJa[group] || key;
}

function statusLabel(key) {
  return isJapanese() ? gameplayJa.statuses[key] || key : key;
}

function monsterLabel(key) {
  return isJapanese() ? gameplayJa.monster[key] || key : key;
}

function itemLabel(kind) {
  return isJapanese() ? gameplayJa.item[kind] || kind : null;
}

function localizeFlashText(text) {
  if (!isJapanese() || typeof text !== "string") return text;
  return text
    .replace("Tap monsters and items", gameplayJa.tapStart)
    .replace(/^Room (\d+)$/, (_, room) => gameplayJa.roomFlash.replace("{room}", room))
    .replace("YOU WIN!", "勝利!")
    .replace("YOU DIED", "ゲームオーバー")
    .replace("STONE LOCK", "石化ロック")
    .replace("Cloud cleared", "雲が晴れた")
    .replace(/^Cloud /, "雲 ")
    .replace("No monster", "対象モンスターなし")
    .replace("No monsters", "対象モンスターなし")
    .replace("No enemies", "対象の敵なし")
    .replace("Bomb hit everyone!", "全員に爆弾!")
    .replace("Clear bomb! No kills.", "クリア爆弾! キルなし")
    .replace("Clean bomb!", "浄化爆弾!")
    .replace("Random bomb!", "ランダム爆弾!")
    .replace("Weaken bomb!", "弱体爆弾!")
    .replace("Strength bomb!", "強化爆弾!")
    .replace("Cloudy bomb!", "雲爆弾!")
    .replace("Charge bomb!", "帯電爆弾!")
    .replace("Poison bomb!", "毒爆弾!")
    .replace("Fire bomb!", "火炎爆弾!")
    .replace("Lava bomb!", "溶岩爆弾!")
    .replace("Contagion bomb!", "感染爆弾!")
    .replace("Shockwave bomb!", "衝撃波爆弾!")
    .replace("Healing bomb!", "回復爆弾!")
    .replace("Ice bomb!", "氷爆弾!")
    .replace("Zombie bomb!", "ゾンビ爆弾!")
    .replace("Stone bomb!", "石化爆弾!")
    .replace("Enrage bomb!", "激怒爆弾!")
    .replace("Blind bomb!", "盲目爆弾!")
    .replace("Stone scroll!", "石化巻物!")
    .replace("Zombie scroll!", "ゾンビ巻物!")
    .replace("Ally scroll!", "味方巻物!")
    .replace("Haunted curse!", "呪い!")
    .replace("Blessed curse!", "祝福!")
    .replace("Necrotic blessing!", "死霊の祝福!")
    .replace("Spontaneous combustion!", "自然発火!")
    .replace("Health swap!", "HP交換!")
    .replace("FLASH BANG!", "閃光弾!")
    .replace("NUKE!", "核爆弾!")
    .replace("Frozen monster cannot counter!", "凍結中は反撃できない!")
    .replace("Stone monster cannot counter!", "石化中は反撃できない!")
    .replace("Blinded monster cannot counter!", "盲目で反撃できない!")
    .replace("Ally turned!", "味方が離反!")
    .replace("A ghost rises!", "ゴーストが蘇る!")
    .replace("Wild counter!", "乱反撃!")
    .replace("Need two souls!", "魂が2つ必要!")
    .replace("Soul connection!", "魂リンク!")
    .replace("Glitched!", "グリッチ!");
}

const itemInfo = [
  ["sword","Sword","Gain attack."],
  ["shield","Defense","Gain defense."],
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
  ["lightningBomb","Lightning bomb","Adds Charge to you and monsters."],
  ["iceBomb","Ice bomb","Freezes monsters temporarily."],
  ["zombieScroll","Zombie scroll","Turns one monster into a zombie."],
  ["shieldBomb","Shield all bomb","Gives you a brown shield and monsters a wood shield."],
  ["stoneBomb","Stone bomb","Turns every current monster into stone."],
  ["nukeBomb","Nuke","Nukes everything."],
  ["enrageBomb","Enrage bomb","Makes monsters attack nearby targets and turn red."],
  ["blindBomb","Blind bomb","Blinds monsters so counters hit random targets."],
  ["stoneScroll","Stone scroll","Makes one monster permanently stone."],
  ["hauntedScroll","Curse scroll","Haunts monsters so they rise once as ghosts."],
  ["blessedScroll","Blessed curse","Heals you when you kill a monster."],
  ["necroticScroll","Necrotic blessing","On death, gain defense."],
  ["allyScroll","Ally scroll","Makes a random monster your ally."],
  ["combustionScroll","Combustion scroll","Starts a 10 second countdown, then pulses its attack as fire damage."],
  ["killRandomItem","Kill random","Kills a random monster or backfires on you."],
  ["healRandomItem","Heal random","Fully heals a random target."],
  ["flashBang","Flash bang","Blinds the screen and stops monster fights for 5 seconds."],
  ["exileItem","Exile","Queues current monsters to reappear later."],
  ["swapHealthItem","HP swap","Shuffles HP across you and current monsters."],
  ["chest","Chest","Opens a random reward."]
];

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
  ["charge","Charge","Shocks the nearest entity every second and spreads Charge."],
  ["combustion","Combustion","Flashes fire colors, counts down, then pulses attack damage every second."],
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
  ensureAudio();
}

function updateMenuOverlay() {
  const visible = gameState === "menu" || gameState === "dead" || gameState === "win";
  menuOverlay.classList.toggle("is-visible", visible);
  if (!visible) return;
  const text = t();

  if (gameState === "dead") {
    menuTitle.textContent = text.dead;
    menuSubtitle.textContent = text.seedTime.replace("{seed}", activeSeed).replace("{time}", formatRunTime(runEndAt || (performance.now() - runStartAt)));
    menuSubtitle.classList.add("seed-retry");
    menuAction.textContent = text.reset;
  } else if (gameState === "win") {
    menuTitle.textContent = text.win;
    menuSubtitle.textContent = text.seedTime.replace("{seed}", activeSeed).replace("{time}", formatRunTime(runEndAt || (performance.now() - runStartAt)));
    menuSubtitle.classList.add("seed-retry");
    menuAction.textContent = text.playAgain;
  } else {
    menuTitle.textContent = text.title;
    menuSubtitle.textContent = text.subtitle;
    menuSubtitle.classList.remove("seed-retry");
    menuAction.textContent = text.start;
  }

  document.documentElement.lang = settings.language === "ja" ? "ja" : "en";
  choicesLabel.textContent = `${text.choices}: ${settings.choices}`;
  choicesLabel.nextElementSibling.setAttribute("aria-label", text.choices);
  languageLabel.textContent = text.language;
  seedLabel.textContent = text.seed;
  infoButton.textContent = text.info;
  infoClose.textContent = text.close;
  infoTitle.textContent = text.info;
  const difficultyLabel = document.querySelector(".difficulty-controls").previousElementSibling;
  difficultyLabel.textContent = text.difficulty;
  seedInput.placeholder = `${currentSeed}`;
  choiceDown.disabled = settings.choices <= 1;
  choiceUp.disabled = settings.choices >= 9;

  for (const button of difficultyButtons) {
    button.classList.toggle("is-selected", button.dataset.difficulty === settings.difficulty);
    button.textContent = text.difficulties[button.dataset.difficulty];
  }

  for (const button of languageButtons) {
    button.classList.toggle("is-selected", button.dataset.language === settings.language);
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
  const row = createInfoRow(icon, name, description, isItem);
  infoList.appendChild(row);
}

function createInfoRow(icon, name, description, isItem = true) {
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
  return row;
}

function itemDisplayName(kind) {
  const item = itemInfo.find(([itemKind]) => itemKind === kind);
  return item ? localizeInfo(item, itemJa)[1] : kind;
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
    shieldCount:kind === "shielded" ? 1 : 0,
    shieldBroken:kind !== "shielded",
    zombie:kind === "zombie" || kind === "ghostZombie",
    ghost:kind === "ghostZombie",
    haunted:kind === "haunted",
    contagious:kind === "contagious",
    echoDamage:kind === "echo",
    charge:kind === "charge" ? 3 : 0,
    combustAt:kind === "combustion" ? performance.now() + 10000 : 0,
    combusting:false,
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
  if ((m.shieldCount || (m.shielded && !m.shieldBroken ? 1 : 0)) > 0 && icons.monsterShield) {
    const shieldSize = m.r * 1.55;
    g.drawImage(icons.monsterShield, 50 + m.r * .45 - shieldSize * .5, 50 - shieldSize * .25, shieldSize, shieldSize);
  }
  return c;
}

function buildInfoList() {
  infoList.innerHTML = "";
  addInfoTitle(isJapanese() ? "アイテム" : "Items");
  for (const item of itemInfo) {
    const localized = localizeInfo(item, itemJa);
    addInfoRow(localized[0], localized[1], localized[2], true);
  }
  addInfoTitle(isJapanese() ? "モンスターと部屋" : "Monsters and rooms");
  for (const monster of monsterInfo) {
    const localized = localizeInfo(monster, monsterJa);
    try {
      const icon = makeMonsterInfoIcon(monster[0]);
      icons[`info_${monster[0]}`] = icon;
      addInfoRow(`info_${monster[0]}`, localized[1], localized[2], true);
    } catch {
      addInfoRow(monster[0].slice(0, 4).toUpperCase(), localized[1], localized[2], false);
    }
  }
}

function sampleBookItems(mode, blessed, count = 3) {
  const category = mode === "prayer" ? blessed ? "good" : "bad" : blessed ? "bad" : "good";
  let pool = itemInfo.filter(([kind]) => itemCategory(kind) === category);
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
  const titleText = isJapanese()
    ? mode === "prayer" ? `${blessed ? "祝福" : "呪い"}の祈りの本` : `${blessed ? "祝福" : "呪い"}の追放の本`
    : mode === "prayer" ? `${prefix} Prayer Book` : `${prefix} Banish Book`;
  sound("bookOpen");
  const overlay = document.createElement("div");
  overlay.className = `book-overlay is-visible book-${mode}`;
  const panel = document.createElement("div");
  panel.className = "book-panel";
  const title = document.createElement("h2");
  title.className = `book-title ${blessed ? "is-blessed" : "is-cursed"}`;
  title.textContent = titleText;
  panel.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "book-list";

  for (const entry of sampleBookItems(mode, blessed)) {
    const [kind,name,description] = localizeInfo(entry, itemJa);
    const button = createInfoRow(kind, name, description, true);
    button.className = "info-row book-choice";
    button.tabIndex = 0;
    button.setAttribute("role", "button");
    button.type = "button";
    const choose = () => {
      if (mode === "prayer") {
        hero.prayers.push({ kind, remaining: 7 });
        flash = isJapanese() ? `${name}を祈った` : `${name} prayed`;
      } else {
        if (!hero.banishedItems.includes(kind)) hero.banishedItems.push(kind);
        flash = isJapanese() ? `${name}を追放` : `${name} banished`;
      }
      sound("bookClose");
      overlay.remove();
    };
    button.addEventListener("click", choose);
    button.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        choose();
      }
    });
    grid.appendChild(button);
  }
  panel.appendChild(grid);
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

menuSubtitle.addEventListener("click", () => {
  if (gameState !== "dead" && gameState !== "win") return;
  seedInput.value = `${activeSeed}`;
  settings.seed = activeSeed;
  seedInput.focus();
});

audioToggle.addEventListener("click", event => {
  event.stopPropagation();
  ensureAudio();
  setAudioMuted(!audioMuted);
});

for (const button of difficultyButtons) {
  button.addEventListener("click", () => {
    settings.difficulty = button.dataset.difficulty;
    updateMenuOverlay();
  });
}

for (const button of languageButtons) {
  button.addEventListener("click", () => {
    settings.language = button.dataset.language;
    buildInfoList();
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
updateAudioToggle();
