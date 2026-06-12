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

function spawnThing(allowExileReturn = true) {
  if (allowExileReturn && exileQueue.length > 0 && rng() < .28) return popExiledMonster();

  const isMonster = rng() < .56;
  const r = Math.min(W,H) * (isMonster ? .076 : .062);
  const p = findFreePosition(r);

  if (isMonster) return makeMonster(p.x, -120 - rng()*200, p.y, r);
  return makeItem(p.x, -120 - rng()*200, p.y, r);
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
  const elite = rng() < .09 + Math.min(.08, kills * .002);

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

  if (elite) {
    hp = Math.floor(hp * 2.8);
    atk = Math.floor(atk * 2.1);
    r *= 1.12;
  }

  const colors = ["#ff7070","#65d7ff","#ffcf4f","#b987ff","#ff8a4f","#ff6fd8","#8fa8ff"];

  return {
    type:"monster",
    x,y,targetY,r,
    vx:(rng()-.5)*1.5,
    vy:0,
    wander:rng()*999,
    hp,maxHp:hp,
    atk,
    poison:0,
    stone:false,
    frozenUntil:0,
    attackCooldownUntil:0,
    fightCooldownUntil:0,
    target:null,
    elite,
    shielded:rng()<.18,
    shieldBroken:false,
    zombie:false,
    ghost:false,
    haunted:false,
    attacking:false,
    parts:{
      color:pick(colors),
      originalColor:null,
      head:pick(["circle","box","triangle","blob"]),
      eyes:rand(1,4),
      mouth:pick(["smile","fangs","void"]),
      horns:rng()<.4,
      legs:rand(1,4),
      arms:rand(0,3)
    }
  };
}

function makeItem(x,y,targetY,r) {
  const kind = pick([
    "sword","shield","potion","potion","poison",
    "bomb","clearBomb","randomBomb","weakenBomb","strengthBomb","shieldBomb",
    "cloudBomb","poisonBomb","healBomb","lightningBomb","iceBomb","zombieBomb",
    "powerPotion","regenPotion","vampirePotion","stoneScroll","hauntedScroll",
    "killRandomItem","healRandomItem","flashBang","exileItem","swapHealthItem","door","chest","chest"
  ]);

  if (kind === "door") {
    const room = pick([1,2,3].filter(n => n !== currentRoom));
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
      kind === "powerPotion" ? rand(6,10) :
      kind === "poison" ? rand(2,4) :
      kind === "bomb" ? rand(25,45) :
      kind === "lightningBomb" ? rand(35,60) :
      kind === "poisonBomb" ? rand(4,8) :
      kind === "healBomb" ? rand(25,50) :
      kind === "randomBomb" ? 0 :
      kind === "clearBomb" ? 0 :
      kind === "weakenBomb" ? rand(2,5) :
      kind === "strengthBomb" ? rand(2,5) :
      kind === "cloudBomb" ? 0 :
      kind === "iceBomb" ? 4 :
      kind === "zombieBomb" ? 0 :
      kind === "shieldBomb" ? 0 :
      kind === "stoneScroll" ? 0 :
      kind === "hauntedScroll" ? 0 :
      kind === "killRandomItem" ? 0 :
      kind === "healRandomItem" ? 0 :
      kind === "flashBang" ? 0 :
      kind === "exileItem" ? 0 :
      kind === "swapHealthItem" ? 0 :
      0
  };
}
