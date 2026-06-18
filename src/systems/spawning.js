function findFreePosition(radius) {
  const top = 155;
  const bottom = Math.max(top + 100, H - 95);

  for (let tries = 0; tries < 100; tries++) {
    const x = radius + 35 + rng() * Math.max(50, (W - radius * 2 - 70));
    const y = top + rng() * Math.max(50, (bottom - top));
    let ok = true;

    for (const other of board) {
      if (dist(x,y,other.x,other.y) < radius + other.r + 58) {
        ok = false;
        break;
      }
    }

    if (ok) return {x,y};
  }

  return {
    x: radius + 35 + rng() * Math.max(50, (W - radius * 2 - 70)),
    y: top + rng() * Math.max(50, (bottom - top))
  };
}

function spawnThing(allowExileReturn = true, replaceIndex = null, forceType = null) {
  for (let tries = 0; tries < 10; tries++) {
    const exileQueueBefore = exileQueue.slice();
    const candidate = sampleSpawnThing(allowExileReturn, forceType);
    if (hero && hero.unlucky > 0 && entityCategory(candidate) === "good" && rng() < Math.min(.75, hero.unlucky * .12)) {
      exileQueue = exileQueueBefore;
      continue;
    }
    if (hero && hero.lucky > 0 && entityCategory(candidate) === "bad" && rng() < Math.min(.75, hero.lucky * .12)) {
      exileQueue = exileQueueBefore;
      continue;
    }
    return candidate;
  }

  return sampleSpawnThing(allowExileReturn, forceType);
}

function sampleSpawnThing(allowExileReturn = true, forceType = null) {
  if (forceType !== "item" && allowExileReturn && exileQueue.length > 0 && rng() < .28) return popExiledMonster();

  const roll = rng();
  const isMonster = forceType ? forceType === "monster" : roll < .52;
  const r = Math.min(W,H) * (isMonster ? .076 : .062);
  const p = findFreePosition(r);

  if (isMonster) {
    if (kills >= 20 && bossKills <= 0 && !bossOnBoard()) return makeBoss(p.x, -160 - rng()*220, p.y, r * 1.75);
    return makeMonster(p.x, -120 - rng()*200, p.y, r);
  }
  return makeItem(p.x, -120 - rng()*200, p.y, r);
}

const itemCategories = {
  sword:"good", shield:"good", potion:"good", poison:"good", powerPotion:"good", regenPotion:"good", vampirePotion:"good",
  moltenPotion:"good", dodgePotion:"good", critPotion:"good", surprisePotion:"good", phoenixPotion:"good", luckyCharm:"good",
  gunpowder:"good", multiplyStatus:"good", triggerStatus:"good", maxHealthUp:"good", prayerBook:"good", banishBook:"good",
  fireBomb:"good", lavaBomb:"good", contagionBomb:"good", echoBomb:"good", soulBomb:"good", iceBomb:"good", blindBomb:"good",
  blessedScroll:"good", necroticScroll:"good", allyScroll:"good", healRandomItem:"good", chest:"good",

  bomb:"mixed", clearBomb:"mixed", cleanBomb:"mixed", randomBomb:"mixed", weakenBomb:"mixed", strengthBomb:"mixed",
  cloudBomb:"mixed", poisonBomb:"mixed", healBomb:"mixed", lightningBomb:"mixed", shieldBomb:"mixed", nukeBomb:"mixed",
  zombieScroll:"mixed", combustionScroll:"mixed", killRandomItem:"mixed", flashBang:"mixed", exileItem:"mixed", swapHealthItem:"mixed",

  decayCurse:"bad", confusionCurse:"bad", glitchCurse:"bad", unluckyCurse:"bad", maxHealthDown:"bad", stoneBomb:"bad",
  enrageBomb:"bad", stoneScroll:"bad", hauntedScroll:"bad"
};

function itemCategory(kind) {
  return itemCategories[kind] || "mixed";
}

function entityCategory(t) {
  if (t.type === "door") return "good";
  if (t.type === "monster") return t.team === "hero" || t.stone ? "good" : "bad";
  if (t.type !== "item") return false;
  return itemCategory(t.kind);
}

function isHelpfulEntity(t) {
  return entityCategory(t) === "good";
}

function popExiledMonster() {
  const m = exileQueue.shift();
  const p = findFreePosition(m.r);
  m.x = p.x;
  m.y = -120 - rng()*200;
  m.targetY = p.y;
  m.vx = (rng() - .5) * 1.5;
  m.vy = 0;
  m.attacking = false;
  m.target = null;
  return m;
}

function makeDoor(x,y,targetY,r,room) {
  return {
    type:"door",
    x,y,targetY,r,
    vx:0,vy:0,
    room
  };
}

function makeMonster(x,y,targetY,r) {
  const ultraElite = rng() < .018 + Math.min(.035, kills * .001);
  const elite = ultraElite || rng() < .09 + Math.min(.08, kills * .002);
  const shieldCount = rng() < .18 ? 1 : 0;

  const hpType = rng();
  const atkType = rng();

  let hp =
    hpType < .18 ? rand(25,45) :
    hpType < .72 ? rand(55,95) :
    rand(120,180);

  let atk =
    atkType < .2 ? rand(5,10) :
    atkType < .78 ? rand(12,20) :
    rand(24,36);

  const s = difficultyScale();
  hp += Math.floor((hero.level * rand(7,16) + kills * rand(0,4)) * s);
  atk += Math.floor((hero.level * rand(1,4) + Math.floor(kills / rand(3,7))) * s);

  if (settings.difficulty === "easy") {
    hp = Math.floor(hp * .8);
    atk = Math.floor(atk * .75);
  }

  if (settings.difficulty === "hard") {
    hp = Math.floor(hp * 1.2);
    atk = Math.floor(atk * 1.15);
  }

  if (currentRoom === 666) {
    hp *= 2;
    atk *= 2;
  }

  if (elite) {
    hp = Math.floor(hp * 2.8);
    atk = Math.floor(atk * 2.1);
    r *= 1.12;
  }

  if (ultraElite) {
    hp = Math.floor(hp * 1.8);
    atk = Math.floor(atk * 1.55);
    r *= 1.1;
  }

  const colors = ["#ff7070","#65d7ff","#ffcf4f","#b987ff","#ff8a4f","#ff6fd8","#8fa8ff"];

  return {
    type:"monster",
    x,y,targetY,r,
    vx:(rng()-.5)*1.5,
    vy:0,
    wander:rng()*999,
    roamX:x,
    roamY:targetY,
    roamUntil:0,
    hp,maxHp:hp,
    atk,
    poison:0,
    fire:0,
    stone:false,
    frozenUntil:0,
    attackCooldownUntil:0,
    fightCooldownUntil:0,
    rageAttackCooldownUntil:0,
    target:null,
    team:"enemy",
    elite,
    ultraElite,
    shielded:shieldCount > 0,
    shieldCount,
    shieldBroken:shieldCount <= 0,
    zombie:false,
    ghost:false,
    haunted:false,
    blind:false,
    rage:false,
    contagious:false,
    echoDamage:false,
    charge:0,
    combustAt:0,
    combusting:false,
    attacking:false,
    parts:{
      color:pick(colors),
      originalColor:null,
      head:pick(["circle","box","triangle","blob"]),
      eyes:rand(1,4),
      mouth:pick(["fangs","void"]),
      horns:rng()<.4,
      legs:rand(1,4),
      arms:rand(0,3)
    }
  };
}

function bossOnBoard() {
  return !!(board && board.some(t => t.type === "monster" && t.boss && t.hp > 0));
}

function makeBoss(x,y,targetY,r) {
  const samples = [];
  for (let i = 0; i < 3; i++) samples.push(makeMonster(x,y,targetY,r * (.55 + rng() * .12)));
  const hp = samples.reduce((sum, m) => sum + m.maxHp, 0);
  const atk = Math.max(...samples.map(m => m.atk)) + Math.floor(samples.reduce((sum, m) => sum + m.atk, 0) * .25);
  const primary = samples[0];

  return {
    ...primary,
    boss:true,
    x,y,targetY,r,
    hp:Math.floor(hp * 1.35),
    maxHp:Math.floor(hp * 1.35),
    atk:Math.max(1, atk),
    elite:true,
    ultraElite:true,
    shielded:true,
    shieldCount:1,
    shieldBroken:false,
    echoDamage:true,
    parts:{
      color:samples[rand(0,2)].parts.color,
      originalColor:null,
      head:samples[rand(0,2)].parts.head,
      eyes:Math.max(2, Math.min(6, samples.reduce((sum, m) => sum + m.parts.eyes, 0))),
      mouth:"fangs",
      horns:samples.some(m => m.parts.horns),
      legs:Math.max(...samples.map(m => m.parts.legs)),
      arms:Math.min(5, samples.reduce((sum, m) => sum + m.parts.arms, 0))
    }
  };
}

function makeItem(x,y,targetY,r) {
  const itemKinds = [
    "sword","shield","potion","potion","poison",
    "bomb","clearBomb","cleanBomb","randomBomb","weakenBomb","strengthBomb","shieldBomb",
    "cloudBomb","poisonBomb","fireBomb","lavaBomb","contagionBomb","echoBomb","soulBomb","healBomb","lightningBomb","iceBomb",
    "stoneBomb","nukeBomb","enrageBomb","blindBomb",
    "powerPotion","regenPotion","vampirePotion","moltenPotion","dodgePotion","critPotion","surprisePotion","decayCurse",
    "phoenixPotion","confusionCurse","glitchCurse","luckyCharm","unluckyCurse","gunpowder","multiplyStatus","triggerStatus","maxHealthUp","maxHealthDown","prayerBook","banishBook","stoneScroll","zombieScroll","hauntedScroll","blessedScroll","necroticScroll","allyScroll","combustionScroll",
    "killRandomItem","healRandomItem","flashBang","exileItem","swapHealthItem","door","chest","chest"
  ];
  const prayer = currentPrayer();
  const banned = hero ? hero.banishedItems : [];
  const allowed = itemKinds.filter(k => prayer && prayer.kind === k || !banned.includes(k));
  let kind = pick(allowed.length ? allowed : itemKinds);
  if (prayer) {
    kind = prayer.kind;
    prayer.remaining--;
    while (hero.prayers.length && hero.prayers[hero.prayers.length - 1].remaining <= 0) hero.prayers.pop();
  }

  if (kind === "door") {
    const room = pick([1,2,3,666].filter(n => n !== currentRoom));
    return makeDoor(x,y,targetY,r * 1.12,room);
  }

  return {
    type:"item",
    kind,x,y,targetY,r,
    vx:0,vy:0,
    value:
      kind === "sword" ? rand(1,3) :
      kind === "shield" ? rand(1,2) :
      kind === "potion" ? rand(22,45) :
      kind === "regenPotion" ? rand(10,16) :
      kind === "vampirePotion" ? rand(6,10) :
      kind === "moltenPotion" ? rand(2,4) :
      kind === "dodgePotion" ? rand(8,14) :
      kind === "critPotion" ? rand(8,14) :
      kind === "surprisePotion" ? rand(5,10) :
      kind === "decayCurse" ? 1 :
      kind === "phoenixPotion" ? 1 :
      kind === "confusionCurse" ? rand(18,28) :
      kind === "glitchCurse" ? 1 :
      kind === "luckyCharm" ? rand(1,2) :
      kind === "unluckyCurse" ? rand(1,2) :
      kind === "gunpowder" ? rand(1,3) :
      kind === "multiplyStatus" ? rand(1,2) :
      kind === "triggerStatus" ? 1 :
      kind === "maxHealthUp" ? rand(10,25) :
      kind === "maxHealthDown" ? rand(10,25) :
      kind === "prayerBook" ? 0 :
      kind === "banishBook" ? 0 :
      kind === "powerPotion" ? rand(6,10) :
      kind === "poison" ? rand(2,4) :
      kind === "bomb" ? rand(25,45) :
      kind === "lightningBomb" ? 1 :
      kind === "poisonBomb" ? rand(4,8) :
      kind === "fireBomb" ? rand(5,9) :
      kind === "lavaBomb" ? rand(10,16) :
      kind === "contagionBomb" ? 0 :
      kind === "echoBomb" ? 0 :
      kind === "soulBomb" ? 0 :
      kind === "healBomb" ? rand(25,50) :
      kind === "randomBomb" ? 0 :
      kind === "clearBomb" ? 0 :
      kind === "cleanBomb" ? 0 :
      kind === "weakenBomb" ? rand(2,5) :
      kind === "strengthBomb" ? rand(2,5) :
      kind === "cloudBomb" ? 0 :
      kind === "iceBomb" ? 4 :
      kind === "zombieScroll" ? 0 :
      kind === "shieldBomb" ? 0 :
      kind === "stoneBomb" ? 0 :
      kind === "nukeBomb" ? 0 :
      kind === "enrageBomb" ? 0 :
      kind === "blindBomb" ? 0 :
      kind === "stoneScroll" ? 0 :
      kind === "hauntedScroll" ? 0 :
      kind === "blessedScroll" ? 0 :
      kind === "necroticScroll" ? 0 :
      kind === "allyScroll" ? 0 :
      kind === "combustionScroll" ? 0 :
      kind === "killRandomItem" ? 0 :
      kind === "healRandomItem" ? 0 :
      kind === "flashBang" ? 0 :
      kind === "exileItem" ? 0 :
      kind === "swapHealthItem" ? 0 :
      0
  };
}
