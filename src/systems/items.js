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
    hero.regenTicks += 6;
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
    if (Math.random() < .5) {
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
  if (item.kind === "randomBomb") explode(item.x, item.y, item.value, "random");
  if (item.kind === "weakenBomb") explode(item.x, item.y, item.value, "weaken");
  if (item.kind === "strengthBomb") explode(item.x, item.y, item.value, "strength");
  if (item.kind === "cloudBomb") explode(item.x, item.y, item.value, "cloud");
  if (item.kind === "lightningBomb") explode(item.x, item.y, item.value, "lightning");
  if (item.kind === "poisonBomb") explode(item.x, item.y, item.value, "poison");
  if (item.kind === "healBomb") explode(item.x, item.y, item.value, "heal");
  if (item.kind === "iceBomb") explode(item.x, item.y, item.value, "ice");
  if (item.kind === "zombieBomb") explode(item.x, item.y, item.value, "zombie");

  if (item.kind === "stoneScroll") stoneRandomMonster(item.x,item.y);
  if (item.kind === "hauntedScroll") hauntMonsters(item.x,item.y);

  if (item.kind === "chest") openChest(item.x, item.y);

  board[index] = spawnThing();
}

function openChest(x,y) {
  const roll = Math.random();

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
    hero.regenTicks += 6;
    hero.regenPower += rand(5,9);
    flash = "Chest: Regen!";
    floatText(x,y,"REGEN","#40ff96");
  } else if (roll < .72) {
    hero.vampire += rand(2,4);
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
  m.stoneUntil = Infinity;
  m.attacking = false;
  m.vx = 0;
  m.vy = 0;
  flash = "Stone scroll!";
  floatText(m.x,m.y,"STONE","#bbbbbb");
  sound("boom");
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
  }

  flash = "Haunted curse!";
  sound("zap");
}

function explode(x,y,power,kind) {
  boom = { x,y, r: Math.max(W,H), t:20, kind };
  shake = 20;

  if (kind === "lightning") sound("zap");
  else sound("boom");

  if (kind === "normal") {
    const heroDmg = Math.floor(power * .6);
    hero.hp -= heroDmg;
    floatText(120,100,"-"+heroDmg,"#ff6b6b");
    flash = `Bomb hit everyone!`;

    for (let i = board.length - 1; i >= 0; i--) {
      const m = board[i];
      if (m.type !== "monster") continue;
      if (performance.now() < m.stoneUntil) {
        floatText(m.x,m.y,"STONE","#bbbbbb");
        continue;
      }
      m.hp -= power;
      floatText(m.x,m.y,"-"+power,"#ff6b6b");
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
    for (let i = 0; i < count; i++) {
      clouds.push({
        x: rand(80, Math.max(90, W-80)),
        y: rand(150, Math.max(160, H-130)),
        r: rand(135,210)
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
      if (performance.now() < m.stoneUntil) {
        floatText(m.x,m.y,"STONE","#bbbbbb");
        continue;
      }
      const dmg = power + 12;
      m.hp -= dmg;
      floatText(m.x,m.y,"⚡ -" + dmg,"#ffe65c");
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
      if (performance.now() < m.stoneUntil) {
        floatText(m.x,m.y,"STONE","#bbbbbb");
        continue;
      }
      m.poison += power;
      floatText(m.x,m.y,`POISON +${power}`,"#7cff4f");
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
      if (now < m.stoneUntil) continue;
      m.frozenUntil = now + 4000;
      m.attacking = false;
      floatText(m.x,m.y,"FROZEN","#72dfff");
    }
  }

  if (kind === "zombie") {
    flash = `Zombie bomb!`;
    for (const m of board) {
      if (m.type !== "monster") continue;
      if (performance.now() < m.stoneUntil) continue;
      m.zombie = true;
      m.target = null;
      m.parts.originalColor = m.parts.color;
      m.parts.color = "#6cff6c";
      m.attacking = false;
      floatText(m.x,m.y,"ZOMBIE","#7aff7a");
    }
  }

  if (hero.hp <= 0) die();
}
