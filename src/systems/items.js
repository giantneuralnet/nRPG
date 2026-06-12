function useItem(item, index) {
  if (item.kind === "sword") {
    hero.atk += item.value;
    flash = `Sword +${item.value} ATK`;
    floatText(item.x,item.y,`ATK +${item.value}`,"#ffffff");
    sound("item");
  }

  if (item.kind === "shield") {
    hero.def += item.value;
    flash = `Shield +${item.value} DEF`;
    floatText(item.x,item.y,`DEF +${item.value}`,"#85bdff");
    sound("item");
  }

  if (item.kind === "potion") {
    heal(hero, item.value, 120, 100);
    flash = `Potion +${item.value} HP`;
  }

  if (item.kind === "regenPotion") {
    hero.regenTicks += 8;
    hero.regenPower += item.value;
    flash = `Regen potion!`;
    floatText(item.x,item.y,`REGEN +${item.value}`,"#40ff96");
    sound("item");
  }

  if (item.kind === "vampirePotion") {
    hero.vampire += item.value;
    flash = `Vampire +${item.value}% life steal`;
    floatText(item.x,item.y,`LIFE STEAL +${item.value}%`,"#ff4f9a");
    sound("item");
  }

  if (item.kind === "powerPotion") {
    if (rng() < .5) {
      hero.powerAtkTurns = 3;
      hero.powerAtkBonus = item.value;
      flash = `Power up! +${item.value} ATK for 3 fights`;
      floatText(item.x,item.y,`ATK +${item.value}`,"#ffd84a");
    } else {
      hero.powerDefTurns = 3;
      hero.powerDefBonus = item.value;
      flash = `Power up! +${item.value} DEF for 3 fights`;
      floatText(item.x,item.y,`DEF +${item.value}`,"#85bdff");
    }
    sound("level");
  }

  if (item.kind === "poison") {
    hero.poison += item.value;
    flash = `Poison Sword +${item.value}`;
    floatText(item.x,item.y,`POISON +${item.value}`,"#7cff4f");
    sound("item");
  }

  if (item.kind === "bomb") explode(item.x, item.y, item.value, "normal");
  if (item.kind === "clearBomb") explode(item.x, item.y, item.value, "clear");
  if (item.kind === "cleanBomb") explode(item.x, item.y, item.value, "clean");
  if (item.kind === "randomBomb") explode(item.x, item.y, item.value, "random");
  if (item.kind === "weakenBomb") explode(item.x, item.y, item.value, "weaken");
  if (item.kind === "strengthBomb") explode(item.x, item.y, item.value, "strength");
  if (item.kind === "cloudBomb") explode(item.x, item.y, item.value, "cloud");
  if (item.kind === "lightningBomb") explode(item.x, item.y, item.value, "lightning");
  if (item.kind === "poisonBomb") explode(item.x, item.y, item.value, "poison");
  if (item.kind === "fireBomb") explode(item.x, item.y, item.value, "fire");
  if (item.kind === "healBomb") explode(item.x, item.y, item.value, "heal");
  if (item.kind === "iceBomb") explode(item.x, item.y, item.value, "ice");
  if (item.kind === "zombieBomb") explode(item.x, item.y, item.value, "zombie");
  if (item.kind === "shieldBomb") shieldAllMonsters(item.x,item.y);
  if (item.kind === "stoneBomb") explode(item.x, item.y, item.value, "stone");
  if (item.kind === "nukeBomb") explode(item.x, item.y, item.value, "nuke");
  if (item.kind === "enrageBomb") explode(item.x, item.y, item.value, "enrage");
  if (item.kind === "blindBomb") explode(item.x, item.y, item.value, "blind");

  if (item.kind === "stoneScroll") stoneRandomMonster(item.x,item.y);
  if (item.kind === "hauntedScroll") hauntMonsters(item.x,item.y);
  if (item.kind === "blessedScroll") blessHero(item.x,item.y);
  if (item.kind === "killRandomItem") killRandomTarget(item.x,item.y);
  if (item.kind === "healRandomItem") healRandomTarget(item.x,item.y);
  if (item.kind === "flashBang") flashBang(item.x,item.y);
  if (item.kind === "exileItem") exileMonsters(item.x,item.y);
  if (item.kind === "swapHealthItem") swapRandomHealth(item.x,item.y);

  if (item.kind === "chest") openChest(item.x, item.y);

  board[index] = spawnThing();
  checkStoneLock();
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

function blessHero(x,y) {
  hero.blessed += 1;
  flash = "Blessed curse!";
  floatText(x,y,"BLESSED","#ffe65c");
  sound("level");
}

function cleanMonster(m) {
  m.poison = 0;
  m.fire = 0;
  m.stone = false;
  m.frozenUntil = 0;
  m.haunted = false;
  m.blind = false;
  m.rage = false;
  m.shielded = false;
  m.shieldBroken = false;
  m.attacking = false;
  m.target = null;
  if (m.parts.originalColor && !m.zombie) {
    m.parts.color = m.parts.originalColor;
    m.parts.originalColor = null;
  }
  if (m.zombie) {
    m.zombie = false;
    if (m.parts.originalColor) {
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
  m.parts.originalColor = m.parts.originalColor || m.parts.color;
  m.parts.color = "#6cff6c";
  m.attacking = false;
}

function randomLivingTargets() {
  return [hero, ...board.filter(t => t.type === "monster")];
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
    if (m.type !== "monster") continue;
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
    if (m.type !== "monster") continue;
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
    board[i] = spawnThing(false);
    count++;
  }

  flash = count ? `Exiled ${count} monsters` : "No monsters to exile!";
  floatText(x,y,count ? "EXILE" : "NO TARGET","#d8ecff");
  if (count) burst(x,y,"#d8ecff",28,8);
  sound(count ? "zap" : "item");
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
      if (m.type !== "monster") continue;
      if (m.stone) {
        floatText(m.x,m.y,"STONE","#bbbbbb");
        continue;
      }
      damage(m,power,m.x,m.y,"#ff6b6b", true);
      if (m.hp <= 0) killMonster(i, false);
    }
  }

  if (kind === "clear") {
    flash = `Clear bomb! No kills.`;
    for (let i = 0; i < board.length; i++) {
      floatText(board[i].x, board[i].y, "CLEARED", "#ffffff");
      board[i] = spawnThing();
    }
    clouds = [];
    burst(x,y,"#ffffff",20,6);
  }

  if (kind === "clean") {
    cleanHero();
    flash = "Clean bomb!";
    floatText(120,100,"CLEAN","#d8ecff");
    for (const m of board) {
      if (m.type !== "monster") continue;
      cleanMonster(m);
      floatText(m.x,m.y,"CLEAN","#d8ecff");
    }
    for (const k of board) {
      if (k.type !== "knight") continue;
      k.rage = false;
      k.target = null;
    }
    clouds = [];
    burst(x,y,"#d8ecff",18,5);
  }

  if (kind === "random") {
    hero.hp = rand(1, hero.maxHp);
    floatText(120,100,"HP = " + hero.hp,"#c86bff");
    flash = `Random bomb!`;

    for (const m of board) {
      if (m.type !== "monster") continue;
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
      if (m.type !== "monster") continue;
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
      if (m.type !== "monster") continue;
      m.atk += amount;
      floatText(m.x,m.y,`ATK +${amount}`,"#ffb15e");
    }
  }

  if (kind === "cloud") {
    flash = `Cloudy bomb!`;
    const count = rand(3,5);
    clouds = [];
    burst(x,y,"#d8ecff",16,5);
    for (let i = 0; i < count; i++) {
      clouds.push({
        x: rand(80, Math.max(90, W-80)),
        y: rand(150, Math.max(160, H-130)),
        r: rand(190,285)
      });
    }
  }

  if (kind === "lightning") {
    const heroDmg = Math.floor(power * .35);
    hero.hp -= heroDmg;
    floatText(120,100,"-"+heroDmg,"#ffe65c");
    flash = `Lightning bomb!`;

    for (let i = board.length - 1; i >= 0; i--) {
      const m = board[i];
      if (m.type !== "monster") continue;
      if (m.stone) {
        floatText(m.x,m.y,"STONE","#bbbbbb");
        continue;
      }
      const dmg = power + 12;
      damage(m,dmg,m.x,m.y,"#ffe65c", true);
      if (m.hp <= 0) killMonster(i, false);
    }
  }

  if (kind === "poison") {
    const heroDmg = Math.floor(power * 1.2);
    hero.hp -= heroDmg;
    hero.poison = Math.max(0, hero.poison - 1);
    floatText(120,100,"-"+heroDmg,"#7cff4f");
    flash = `Poison bomb!`;

    for (const m of board) {
      if (m.type !== "monster") continue;
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
      if (m.type !== "monster") continue;
      if (m.stone) {
        floatText(m.x,m.y,"STONE","#bbbbbb");
        continue;
      }
      m.fire += power;
      floatText(m.x,m.y,`FIRE +${power}`,"#ff7a2f");
      burst(m.x,m.y,"#ff7a2f",10,4);
    }
  }

  if (kind === "heal") {
    heal(hero, power, 120, 100);
    flash = `Healing bomb!`;

    for (const m of board) {
      if (m.type !== "monster") continue;
      const amount = Math.floor(power * .6);
      m.hp = Math.min(m.maxHp, m.hp + amount);
      floatText(m.x,m.y,"+"+amount,"#70ff8a");
    }
  }

  if (kind === "ice") {
    const now = performance.now();
    flash = `Ice bomb!`;
    for (const m of board) {
      if (m.type !== "monster") continue;
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
      if (m.type !== "monster") continue;
      if (m.stone) continue;
      zombifyMonster(m);
      floatText(m.x,m.y,"ZOMBIE","#7aff7a");
      burst(m.x,m.y,"#7aff7a",12,4);
    }
  }

  if (kind === "stone") {
    flash = `Stone bomb!`;
    for (const m of board) {
      if (m.type !== "monster") continue;
      m.stone = true;
      m.attacking = false;
      m.vx = 0;
      m.vy = 0;
      floatText(m.x,m.y,"STONE","#bbbbbb");
    }
  }

  if (kind === "nuke") {
    flash = `NUKE!`;
    hero.hp = 1;
    for (let i = board.length - 1; i >= 0; i--) {
      const t = board[i];
      floatText(t.x,t.y,t.type === "monster" ? "KO" : "NUKED","#ff4f4f");
      board[i] = spawnThing();
    }
    burst(x,y,"#ff4f4f",30,9);
  }

  if (kind === "enrage") {
    hero.rage = true;
    flash = `Enrage bomb!`;
    floatText(120,100,"RAGE","#ff3b3b");
    for (const k of board) {
      if (k.type === "knight") {
        k.rage = true;
        floatText(k.x,k.y,"RAGE","#ff3b3b");
      }
    }
    for (const m of board) {
      if (m.type !== "monster") continue;
      m.rage = true;
      m.parts.originalColor = m.parts.originalColor || m.parts.color;
      m.parts.color = "#ff3b3b";
      floatText(m.x,m.y,"RAGE","#ff3b3b");
    }
  }

  if (kind === "blind") {
    flash = `Blind bomb!`;
    for (const m of board) {
      if (m.type !== "monster") continue;
      m.blind = true;
      m.attacking = false;
      floatText(m.x,m.y,"BLIND","#ffffff");
    }
    burst(x,y,"#ffffff",18,5);
  }

  if (hero.hp <= 0) die();
  checkStoneLock();
}
