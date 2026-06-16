function isCombatant(t) {
  return t.type === "monster";
}

function useItem(item, index) {
  const times = 1 + Math.max(0, hero.trigger || 0);
  applyItemEffect(item);
  for (let i = 1; i < times; i++) {
    setTimeout(() => {
      if (gameState === "playing") applyItemEffect(item);
    }, i * 400);
  }
  board[index] = spawnThing(true, index);
  checkStoneLock();
}

function applyItemEffect(item) {
  const value = Math.max(0, Math.floor((item.value || 0) * (hero.multiply || 1)));
  if (item.kind === "sword") {
    hero.atk += value;
    flash = `Sword +${value} ATK`;
    floatText(item.x,item.y,`ATK +${value}`,"#ffffff");
    sound("item");
  }

  if (item.kind === "shield") {
    hero.def += value;
    flash = `Shield +${value} DEF`;
    floatText(item.x,item.y,`DEF +${value}`,"#85bdff");
    sound("item");
  }

  if (item.kind === "potion") {
    heal(hero, value, 120, 100);
    flash = `Potion +${value} HP`;
  }

  if (item.kind === "regenPotion") {
    hero.regenTicks += 8;
    hero.regenPower += value;
    flash = `Regen potion!`;
    floatText(item.x,item.y,`REGEN +${value}`,"#40ff96");
    sound("item");
  }

  if (item.kind === "vampirePotion") {
    hero.vampire += value;
    flash = `Vampire +${value}% life steal`;
    floatText(item.x,item.y,`LIFE STEAL +${value}%`,"#ff4f9a");
    sound("item");
  }

  if (item.kind === "moltenPotion") addHeroStatus("molten", value, item.x, item.y, "MOLTEN", "#ff7a2f");
  if (item.kind === "dodgePotion") addHeroStatus("dodge", value, item.x, item.y, "DODGE", "#72dfff");
  if (item.kind === "critPotion") addHeroStatus("crit", value, item.x, item.y, "CRIT", "#ffe65c");
  if (item.kind === "surprisePotion") addHeroStatus("surprise", value, item.x, item.y, "SURPRISE", "#ffffff");
  if (item.kind === "decayCurse") addHeroStatus("decay", value, item.x, item.y, "DECAY", "#8f6bff");
  if (item.kind === "phoenixPotion") addHeroStatus("phoenix", value, item.x, item.y, "PHOENIX", "#ff9d3b");
  if (item.kind === "confusionCurse") addHeroStatus("confused", value, item.x, item.y, "CONFUSED", "#c86bff");
  if (item.kind === "glitchCurse") {
    addHeroStatus("glitched", value, item.x, item.y, "GLITCH", "#65d7ff");
    hero.glitchNextAt = performance.now() + rand(500,1000);
  }
  if (item.kind === "luckyCharm") addHeroStatus("lucky", value, item.x, item.y, "LUCKY", "#70ff8a");
  if (item.kind === "unluckyCurse") addHeroStatus("unlucky", value, item.x, item.y, "UNLUCKY", "#bbbbbb");
  if (item.kind === "gunpowder") addHeroStatus("gunpowder", value, item.x, item.y, "GUNPOWDER", "#ffcf4f");
  if (item.kind === "multiplyStatus") addHeroStatus("multiply", value, item.x, item.y, "MULTIPLY", "#ffe65c");
  if (item.kind === "triggerStatus") addHeroStatus("trigger", value, item.x, item.y, "TRIGGER", "#d8ecff");
  if (item.kind === "prayerBook") openItemBook("prayer");
  if (item.kind === "banishBook") openItemBook("banish");

  if (item.kind === "maxHealthUp") {
    hero.maxHp += value;
    hero.hp = Math.min(hero.maxHp, hero.hp + value);
    flash = `Max HP +${value}`;
    floatText(item.x,item.y,`MAX +${value}`,"#70ff8a");
    sound("item");
  }
  if (item.kind === "maxHealthDown") {
    hero.maxHp = Math.max(1, hero.maxHp - value);
    hero.hp = Math.min(hero.hp, hero.maxHp);
    flash = `Max HP -${value}`;
    floatText(item.x,item.y,`MAX -${value}`,"#ff6b6b");
    sound("item");
  }

  if (item.kind === "powerPotion") {
    if (rng() < .5) {
      hero.powerAtkTurns = 3;
      hero.powerAtkBonus = value;
      flash = `Power up! +${value} ATK for 3 fights`;
      floatText(item.x,item.y,`ATK +${value}`,"#ffd84a");
    } else {
      hero.powerDefTurns = 3;
      hero.powerDefBonus = value;
      flash = `Power up! +${value} DEF for 3 fights`;
      floatText(item.x,item.y,`DEF +${value}`,"#85bdff");
    }
    sound("level");
  }

  if (item.kind === "poison") {
    hero.poison += value;
    flash = `Poison Sword +${value}`;
    floatText(item.x,item.y,`POISON +${value}`,"#7cff4f");
    sound("item");
  }

  if (item.kind === "bomb") explode(item.x, item.y, value, "normal");
  if (item.kind === "clearBomb") explode(item.x, item.y, value, "clear");
  if (item.kind === "cleanBomb") explode(item.x, item.y, value, "clean");
  if (item.kind === "randomBomb") explode(item.x, item.y, value, "random");
  if (item.kind === "weakenBomb") explode(item.x, item.y, value, "weaken");
  if (item.kind === "strengthBomb") explode(item.x, item.y, value, "strength");
  if (item.kind === "cloudBomb") explode(item.x, item.y, value, "cloud");
  if (item.kind === "lightningBomb") explode(item.x, item.y, value, "lightning");
  if (item.kind === "poisonBomb") explode(item.x, item.y, value, "poison");
  if (item.kind === "fireBomb") explode(item.x, item.y, value, "fire");
  if (item.kind === "lavaBomb") explode(item.x, item.y, value, "lava");
  if (item.kind === "contagionBomb") explode(item.x, item.y, value, "contagion");
  if (item.kind === "echoBomb") explode(item.x, item.y, value, "echo");
  if (item.kind === "soulBomb") explode(item.x, item.y, value, "soul");
  if (item.kind === "healBomb") explode(item.x, item.y, value, "heal");
  if (item.kind === "iceBomb") explode(item.x, item.y, value, "ice");
  if (item.kind === "zombieScroll") zombieRandomMonster(item.x,item.y);
  if (item.kind === "shieldBomb") shieldAllMonsters(item.x,item.y);
  if (item.kind === "stoneBomb") explode(item.x, item.y, value, "stone");
  if (item.kind === "nukeBomb") explode(item.x, item.y, value, "nuke");
  if (item.kind === "enrageBomb") explode(item.x, item.y, value, "enrage");
  if (item.kind === "blindBomb") explode(item.x, item.y, value, "blind");

  if (item.kind === "stoneScroll") stoneRandomMonster(item.x,item.y);
  if (item.kind === "hauntedScroll") hauntMonsters(item.x,item.y);
  if (item.kind === "blessedScroll") blessHero(item.x,item.y);
  if (item.kind === "allyScroll") allyRandomMonster(item.x,item.y);
  if (item.kind === "combustionScroll") combustRandomMonster(item.x,item.y);
  if (item.kind === "killRandomItem") killRandomTarget(item.x,item.y);
  if (item.kind === "healRandomItem") healRandomTarget(item.x,item.y);
  if (item.kind === "flashBang") flashBang(item.x,item.y);
  if (item.kind === "exileItem") exileMonsters(item.x,item.y);
  if (item.kind === "swapHealthItem") swapRandomHealth(item.x,item.y);

  if (item.kind === "chest") openChest(item.x, item.y);

}

function openChest(x,y) {
  const roll = rng();

  if (roll < .13) {
    const amount = rand(30,60);
    heal(hero, amount, 120, 100);
    flash = `Chest: +${amount} HP`;
  } else if (roll < .26) {
    const atk = rand(2,5);
    hero.atk += atk;
    flash = `Chest: +${atk} ATK`;
    floatText(x,y,`ATK +${atk}`,"#ffffff");
  } else if (roll < .39) {
    const def = rand(1,4);
    hero.def += def;
    flash = `Chest: +${def} DEF`;
    floatText(x,y,`DEF +${def}`,"#85bdff");
  } else if (roll < .52) {
    const psn = rand(3,6);
    hero.poison += psn;
    flash = `Chest: +${psn} Poison`;
    floatText(x,y,`POISON +${psn}`,"#7cff4f");
  } else if (roll < .62) {
    hero.regenTicks += 8;
    hero.regenPower += rand(10,16);
    flash = "Chest: Regen!";
    floatText(x,y,"REGEN","#40ff96");
  } else if (roll < .72) {
    hero.vampire += rand(6,10);
    flash = "Chest: Vampire!";
    floatText(x,y,"LIFE STEAL","#ff4f9a");
  } else if (roll < .8) {
    explode(x,y,rand(25,45),"normal");
  } else if (roll < .9) {
    explode(x,y,4,"ice");
  } else {
    explode(x,y,0,"zombie");
  }

  sound("item");
}

function addHeroStatus(field, amount, x, y, label, color) {
  hero[field] += amount;
  flash = `${label} +${amount}`;
  floatText(x,y,`${label} +${amount}`,color);
  sound("item");
}

function stoneRandomMonster(x,y) {
  const monsters = board.filter(t => t.type === "monster");
  if (monsters.length <= 0) {
    flash = "No monster to stone!";
    floatText(x,y,"NO TARGET","#bbb");
    sound("item");
    return;
  }

  const m = pick(monsters);
  m.stone = true;
  m.attacking = false;
  m.vx = 0;
  m.vy = 0;
  flash = "Stone scroll!";
  floatText(m.x,m.y,"STONE","#bbbbbb");
  burst(m.x,m.y,"#bbbbbb",16,4);
  sound("boom");
}

function zombieRandomMonster(x,y) {
  const monsters = board.filter(t => t.type === "monster" && t.team !== "hero" && !t.stone);
  if (monsters.length <= 0) {
    flash = "No monster to zombify!";
    floatText(x,y,"NO TARGET","#7aff7a");
    sound("item");
    return;
  }

  const m = pick(monsters);
  zombifyMonster(m);
  flash = "Zombie scroll!";
  floatText(m.x,m.y,"ZOMBIE","#7aff7a");
  burst(m.x,m.y,"#7aff7a",16,4);
  sound("boom");
}

function blessHero(x,y) {
  hero.blessed += 1;
  flash = "Blessed curse!";
  floatText(x,y,"BLESSED","#ffe65c");
  sound("level");
}

function allyRandomMonster(x,y) {
  const monsters = board.filter(t => t.type === "monster" && t.team !== "hero");
  if (monsters.length <= 0) {
    flash = "No monster to ally!";
    floatText(x,y,"NO TARGET","#d8ecff");
    sound("item");
    return;
  }

  const m = pick(monsters);
  m.team = "hero";
  m.target = null;
  m.attacking = false;
  if (m.parts) m.parts.mouth = "smile";
  flash = "Ally scroll!";
  floatText(m.x,m.y,"ALLY","#d8ecff");
  burst(m.x,m.y,"#d8ecff",16,4);
  sound("level");
}

function combustRandomMonster(x,y) {
  const monsters = board.filter(t => t.type === "monster" && !t.stone && !t.combustAt);
  if (monsters.length <= 0) {
    flash = "No monster to combust!";
    floatText(x,y,"NO TARGET","#ff9d3b");
    sound("item");
    return;
  }

  const m = pick(monsters);
  m.combustAt = performance.now() + 10000;
  flash = "Spontaneous combustion!";
  floatText(m.x,m.y,"10","#ff9d3b");
  burst(m.x,m.y,"#ff9d3b",16,4);
  sound("zap");
}

function cleanMonster(m) {
  m.poison = 0;
  m.fire = 0;
  m.stone = false;
  m.frozenUntil = 0;
  m.haunted = false;
  m.blind = false;
  m.rage = false;
  m.contagious = false;
  m.echoDamage = false;
  m.combustAt = 0;
  m.shielded = false;
  m.shieldBroken = false;
  m.attacking = false;
  m.target = null;
  if (m.parts && m.parts.originalColor && !m.zombie) {
    m.parts.color = m.parts.originalColor;
    m.parts.originalColor = null;
  }
  if (m.zombie) {
    m.zombie = false;
    if (m.parts && m.parts.originalColor) {
      m.parts.color = m.parts.originalColor;
      m.parts.originalColor = null;
    }
  }
}

function cleanHero() {
  hero.poison = 0;
  hero.powerAtkTurns = 0;
  hero.powerDefTurns = 0;
  hero.powerAtkBonus = 0;
  hero.powerDefBonus = 0;
  hero.regenTicks = 0;
  hero.regenPower = 0;
  hero.vampire = 0;
  hero.blessed = 0;
  hero.rage = false;
  hero.molten = 0;
  hero.dodge = 0;
  hero.crit = 0;
  hero.surprise = 0;
  hero.decay = 0;
  hero.phoenix = 0;
  hero.confused = 0;
  hero.glitched = 0;
  hero.glitchNextAt = 0;
  hero.unlucky = 0;
  hero.gunpowder = 0;
  hero.trigger = 0;
  hero.multiply = 1;
  hero.lucky = 0;
  hero.prayerKind = null;
  hero.prayerRemaining = 0;
  hero.banishedItems = [];
  blindUntil = 0;
}

function zombifyMonster(m) {
  if (!m.zombie) {
    m.hp = Math.max(1, Math.floor(m.hp * .5));
    m.maxHp = Math.max(1, Math.floor(m.maxHp * .5));
    m.atk = Math.max(1, Math.floor(m.atk * .5));
  }
  m.zombie = true;
  m.target = null;
  if (m.parts) {
    m.parts.originalColor = m.parts.originalColor || m.parts.color;
    m.parts.color = "#6cff6c";
  }
  m.attacking = false;
}

function spontaneousCombust(m) {
  if (!m || m.type !== "monster") return;
  m.combustAt = 0;
  flash = "Spontaneous combustion!";
  floatText(m.x,m.y,"BOOM","#ff9d3b");
  explode(m.x,m.y,Math.max(1, m.atk),"normal");
}

function replaceDefeated(index, giveXp = false) {
  const t = board[index];
  if (!t) return;
  if (t.type === "monster") killMonster(index, giveXp && t.team !== "hero");
}

function randomLivingTargets() {
  return [hero, ...board.filter(isCombatant)];
}

function killRandomTarget(x,y) {
  const target = pick(randomLivingTargets());

  if (target === hero) {
    hero.hp = 0;
    floatText(120,100,"DOOM","#ff6b6b");
    flash = "Kill charm backfired!";
    sound("dead");
    die();
    return;
  }

  const index = board.indexOf(target);
  floatText(target.x,target.y,"KILL","#ffffff");
  flash = "Kill charm!";
  killMonster(index, true);
}

function healRandomTarget(x,y) {
  const target = pick(randomLivingTargets());

  if (target === hero) {
    heal(hero, hero.maxHp, 120, 100);
    flash = "Random heal: hero!";
    return;
  }

  target.hp = target.maxHp;
  floatText(target.x,target.y,"FULL HP","#70ff8a");
  flash = "Random heal: monster!";
  sound("item");
}

function flashBang(x,y) {
  blindUntil = performance.now() + 5000;
  for (const m of board) {
    if (!isCombatant(m)) continue;
    m.attacking = false;
    m.target = null;
  }
  flash = "FLASH BANG!";
  floatText(x,y,"BLIND","#ffffff");
  burst(x,y,"#ffffff",30,8);
  sound("zap");
}

function shieldAllMonsters(x,y) {
  let count = 0;
  for (const m of board) {
    if (!isCombatant(m)) continue;
    m.shielded = true;
    m.shieldBroken = false;
    floatText(m.x,m.y,"SHIELD","#85bdff");
    count++;
  }

  flash = count ? "Shield all!" : "No monsters to shield!";
  floatText(x,y,count ? "SHIELD ALL" : "NO TARGET","#85bdff");
  if (count) burst(x,y,"#d69a55",14,4);
  sound("item");
}

function exileMonsters(x,y) {
  let count = 0;
  for (let i = 0; i < board.length; i++) {
    const t = board[i];
    if (t.type !== "monster") continue;
    exileQueue.push(t);
    board[i] = spawnThing(false, i);
    count++;
  }

  flash = count ? `Exiled ${count} monsters` : "No monsters to exile!";
  floatText(x,y,count ? "EXILE" : "NO TARGET","#d8ecff");
  if (count) burst(x,y,"#d8ecff",28,8);
  sound(count ? "zap" : "item");
}

function randomizeCloudCoveredPositions() {
  const movable = board.filter(t => t.type === "item" || t.type === "monster");
  const fixed = board.filter(t => t.type !== "item" && t.type !== "monster");
  const placed = fixed.map(t => ({ x:t.x, y:t.y, r:t.r }));
  const top = 155;
  const bottom = Math.max(top + 100, H - 95);

  for (const t of movable) {
    let position = null;
    for (let tries = 0; tries < 100; tries++) {
      const x = t.r + 35 + rng() * Math.max(50, (W - t.r * 2 - 70));
      const y = top + rng() * Math.max(50, (bottom - top));
      if (placed.every(other => dist(x,y,other.x,other.y) >= t.r + other.r + 58)) {
        position = { x, y };
        break;
      }
    }

    if (!position) {
      position = {
        x: t.r + 35 + rng() * Math.max(50, (W - t.r * 2 - 70)),
        y: top + rng() * Math.max(50, (bottom - top))
      };
    }

    t.x = position.x;
    t.y = position.y;
    t.targetY = position.y;
    t.vx = 0;
    t.vy = 0;
    if (t.type === "monster") t.attacking = false;
    placed.push({ x:t.x, y:t.y, r:t.r });
  }
}

function swapAllEntityPositions() {
  if (board.length < 2) return;
  const positions = board.map(t => ({ x:t.x, y:t.y, targetY:t.targetY }));
  for (let i = positions.length - 1; i > 0; i--) {
    const j = rand(0, i);
    const tmp = positions[i];
    positions[i] = positions[j];
    positions[j] = tmp;
  }
  for (let i = 0; i < board.length; i++) {
    const t = board[i];
    t.x = positions[i].x;
    t.y = positions[i].y;
    t.targetY = positions[i].targetY;
    t.vx = 0;
    t.vy = 0;
    if (t.type === "monster") t.attacking = false;
  }
}

function swapRandomHealth(x,y) {
  const targets = randomLivingTargets();
  if (targets.length < 2) {
    flash = "No health to swap!";
    sound("item");
    return;
  }

  const hp = targets.map(t => t.hp);
  for (let i = hp.length - 1; i > 0; i--) {
    const j = rand(0, i);
    const tmp = hp[i];
    hp[i] = hp[j];
    hp[j] = tmp;
  }

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    t.hp = Math.max(1, Math.min(t.maxHp, hp[i]));
    floatText(t === hero ? 120 : t.x, t === hero ? 100 : t.y, "SWAP","#c86bff");
  }

  flash = "Health swap!";
  burst(x,y,"#c86bff",26,7);
  sound("item");
}

function hauntMonsters(x,y) {
  const monsters = board.filter(t => t.type === "monster" && !t.ghost);
  if (monsters.length <= 0) {
    flash = "No monster to haunt!";
    floatText(x,y,"NO TARGET","#b987ff");
    sound("item");
    return;
  }

  for (const m of monsters) {
    m.haunted = true;
    floatText(m.x,m.y,"HAUNTED","#b987ff");
    burst(m.x,m.y,"#b987ff",12,4);
  }

  flash = "Haunted curse!";
  sound("zap");
}

function explode(x,y,power,kind) {
  if (["normal","lightning","poison","fire","lava"].includes(kind) && hero.gunpowder > 0) {
    power = Math.floor(power * (1 + hero.gunpowder * .5));
  }
  boom = { x,y, r: Math.max(W,H), t:20, kind };
  shake = 20;

  if (kind === "lightning") sound("zap");
  else if (kind === "clean") sound("item");
  else sound("boom");

  if (kind === "normal") {
    const heroDmg = Math.floor(power * .6);
    hero.hp -= heroDmg;
    floatText(120,100,"-"+heroDmg,"#ff6b6b");
    flash = `Bomb hit everyone!`;

    for (let i = board.length - 1; i >= 0; i--) {
      const m = board[i];
      if (!isCombatant(m)) continue;
      if (m.stone) {
        floatText(m.x,m.y,"STONE","#bbbbbb");
        continue;
      }
      damage(m,power,m.x,m.y,"#ff6b6b", true);
      if (m.hp <= 0) replaceDefeated(i, false);
    }
  }

  if (kind === "clear") {
    flash = `Clear bomb! No kills.`;
    for (let i = 0; i < board.length; i++) {
      floatText(board[i].x, board[i].y, "CLEARED", "#ffffff");
      board[i] = spawnThing(true, i);
    }
    clouds = [];
    lavaPools = [];
    soulLinks = [];
    shockwaves = [];
    burst(x,y,"#ffffff",20,6);
  }

  if (kind === "clean") {
    cleanHero();
    flash = "Clean bomb!";
    floatText(120,100,"CLEAN","#d8ecff");
    for (const m of board) {
      if (!isCombatant(m)) continue;
      cleanMonster(m);
      floatText(m.x,m.y,"CLEAN","#d8ecff");
    }
    clouds = [];
    lavaPools = [];
    soulLinks = [];
    shockwaves = [];
    burst(x,y,"#d8ecff",18,5);
  }

  if (kind === "random") {
    hero.hp = rand(1, hero.maxHp);
    floatText(120,100,"HP = " + hero.hp,"#c86bff");
    flash = `Random bomb!`;

    for (const m of board) {
      if (!isCombatant(m)) continue;
      m.hp = rand(1, m.maxHp);
      floatText(m.x,m.y,"HP = " + m.hp,"#c86bff");
    }
  }

  if (kind === "weaken") {
    const amount = power;
    hero.atk = Math.max(1, hero.atk - amount);
    floatText(120,100,`ATK -${amount}`,"#bbbbbb");
    flash = `Weaken bomb!`;

    for (const m of board) {
      if (!isCombatant(m)) continue;
      m.atk = Math.max(1, m.atk - amount);
      floatText(m.x,m.y,`ATK -${amount}`,"#bbbbbb");
    }
  }

  if (kind === "strength") {
    const amount = power;
    hero.atk += amount;
    floatText(120,100,`ATK +${amount}`,"#ffb15e");
    flash = `Strength bomb!`;

    for (const m of board) {
      if (!isCombatant(m)) continue;
      m.atk += amount;
      floatText(m.x,m.y,`ATK +${amount}`,"#ffb15e");
    }
  }

  if (kind === "cloud") {
    flash = `Cloudy bomb!`;
    const hits = rand(3,9);
    clouds = [{ hits, maxHits: hits, lastTap: 0 }];
    randomizeCloudCoveredPositions();
    burst(x,y,"#d8ecff",16,5);
  }

  if (kind === "lightning") {
    const heroDmg = Math.floor(power * .35);
    hero.hp -= heroDmg;
    floatText(120,100,"-"+heroDmg,"#ffe65c");
    flash = `Lightning bomb!`;

    for (let i = board.length - 1; i >= 0; i--) {
      const m = board[i];
      if (!isCombatant(m)) continue;
      if (m.stone) {
        floatText(m.x,m.y,"STONE","#bbbbbb");
        continue;
      }
      const dmg = power + 12;
      damage(m,dmg,m.x,m.y,"#ffe65c", true);
      if (m.hp <= 0) replaceDefeated(i, false);
    }
  }

  if (kind === "poison") {
    const heroDmg = Math.floor(power * 1.2);
    hero.hp -= heroDmg;
    hero.poison = Math.max(0, hero.poison - 1);
    floatText(120,100,"-"+heroDmg,"#7cff4f");
    flash = `Poison bomb!`;

    for (const m of board) {
      if (!isCombatant(m)) continue;
      if (m.stone) {
        floatText(m.x,m.y,"STONE","#bbbbbb");
        continue;
      }
      m.poison += power;
      floatText(m.x,m.y,`POISON +${power}`,"#7cff4f");
      burst(m.x,m.y,"#7cff4f",10,4);
    }
  }

  if (kind === "fire") {
    flash = `Fire bomb!`;
    for (const m of board) {
      if (!isCombatant(m)) continue;
      if (m.stone) {
        floatText(m.x,m.y,"STONE","#bbbbbb");
        continue;
      }
      m.fire += power;
      floatText(m.x,m.y,`FIRE +${power}`,"#ff7a2f");
      burst(m.x,m.y,"#ff7a2f",10,4);
    }
  }

  if (kind === "lava") {
    flash = `Lava bomb!`;
    lavaPools = [];
    for (const m of board) {
      if (!isCombatant(m)) continue;
      if (m.team === "hero") continue;
      lavaPools.push({
        x: m.x,
        y: m.y,
        r: rand(75,130),
        life: rand(900,1300),
        fire: Math.max(3, Math.floor(power * .18))
      });
      floatText(m.x,m.y,"LAVA","#ff7a2f");
    }
    burst(x,y,"#ff7a2f",20,7);
  }

  if (kind === "contagion") {
    let count = 0;
    flash = `Contagion bomb!`;
    for (const m of board) {
      if (!isCombatant(m)) continue;
      m.contagious = true;
      floatText(m.x,m.y,"CONTAGION","#57ff75");
      burst(m.x,m.y,"#57ff75",10,4);
      count++;
    }
    if (!count) flash = "No monsters to infect!";
  }

  if (kind === "echo") {
    let count = 0;
    flash = `Shockwave bomb!`;
    for (const m of board) {
      if (!isCombatant(m) || m.team === "hero") continue;
      m.echoDamage = true;
      floatText(m.x,m.y,"SHOCK","#72dfff");
      burst(m.x,m.y,"#72dfff",10,4);
      count++;
    }
    if (!count) flash = "No enemies to shock!";
  }

  if (kind === "soul") {
    const monsters = board.filter(t => t.type === "monster" && t.team !== "hero");
    if (monsters.length < 2) {
      flash = "Need two souls!";
      floatText(x,y,"NO LINK","#ff4f4f");
      sound("item");
    } else {
      const a = pick(monsters);
      let b = pick(monsters);
      while (b === a) b = pick(monsters);
      soulLinks.push({ a, b });
      flash = "Soul connection!";
      floatText(a.x,a.y,"SOUL","#ff3333");
      floatText(b.x,b.y,"SOUL","#ff3333");
      burst(x,y,"#ff3333",18,6);
    }
  }

  if (kind === "heal") {
    heal(hero, power, 120, 100);
    flash = `Healing bomb!`;

    for (const m of board) {
      if (!isCombatant(m)) continue;
      const amount = Math.floor(power * .6);
      m.hp = Math.min(m.maxHp, m.hp + amount);
      floatText(m.x,m.y,"+"+amount,"#70ff8a");
    }
  }

  if (kind === "ice") {
    const now = performance.now();
    flash = `Ice bomb!`;
    for (const m of board) {
      if (!isCombatant(m)) continue;
      if (m.stone) continue;
      m.frozenUntil = now + 4000;
      m.attacking = false;
      floatText(m.x,m.y,"FROZEN","#72dfff");
      burst(m.x,m.y,"#72dfff",12,4);
    }
  }

  if (kind === "zombie") {
    flash = `Zombie bomb!`;
    for (const m of board) {
      if (!isCombatant(m)) continue;
      if (m.stone) continue;
      zombifyMonster(m);
      floatText(m.x,m.y,"ZOMBIE","#7aff7a");
      burst(m.x,m.y,"#7aff7a",12,4);
    }
  }

  if (kind === "stone") {
    flash = `Stone bomb!`;
    for (const m of board) {
      if (!isCombatant(m)) continue;
      m.stone = true;
      m.attacking = false;
      m.vx = 0;
      m.vy = 0;
      floatText(m.x,m.y,"STONE","#bbbbbb");
    }
  }

  if (kind === "nuke") {
    const killed = board.filter(t => t.type === "monster" && t.team !== "hero").length;
    kills += killed;
    flash = killed > 0 ? `NUKE! +${killed} kills` : `NUKE!`;
    for (let i = board.length - 1; i >= 0; i--) {
      const t = board[i];
      floatText(t.x,t.y,t.type === "monster" ? "KO" : "NUKED","#ff4f4f");
      board[i] = spawnThing(true, i);
    }
    burst(x,y,"#ff4f4f",30,9);
    hero.hp = 0;
    hero.alive = false;
    gameState = "dead";
    flash = "NUKED";
    sound("dead");
  }

  if (kind === "enrage") {
    hero.rage = true;
    flash = `Enrage bomb!`;
    floatText(120,100,"RAGE","#ff3b3b");
    for (const m of board) {
      if (!isCombatant(m)) continue;
      m.rage = true;
      if (m.parts) {
        m.parts.originalColor = m.parts.originalColor || m.parts.color;
        m.parts.color = "#ff3b3b";
      }
      floatText(m.x,m.y,"RAGE","#ff3b3b");
    }
  }

  if (kind === "blind") {
    flash = `Blind bomb!`;
    for (const m of board) {
      if (!isCombatant(m)) continue;
      m.blind = true;
      m.attacking = false;
      floatText(m.x,m.y,"BLIND","#ffffff");
    }
    burst(x,y,"#ffffff",18,5);
  }

  if (hero.hp <= 0) die();
  checkStoneLock();
}
