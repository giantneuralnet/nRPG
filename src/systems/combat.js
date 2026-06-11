function poisonTick() {
  if (gameState !== "playing") return;

  if (hero.regenTicks > 0) {
    const amount = Math.max(1, Math.floor(hero.regenPower * 1.25));
    heal(hero, amount, 120, 100);
    hero.regenTicks--;
    if (hero.regenTicks <= 0) hero.regenPower = 0;
  }

  for (let i = board.length - 1; i >= 0; i--) {
    const m = board[i];
    if (m.type !== "monster" || m.poison <= 0) continue;

    if (m.stone) {
      floatText(m.x, m.y, "STONE", "#bbbbbb");
      continue;
    }

    const dmg = m.poison;
    m.hp -= dmg;
    m.poison = Math.max(0, m.poison - 1);
    floatText(m.x, m.y, "☠ -" + dmg, "#7cff4f");

    if (m.hp <= 0) killMonster(i, true);
  }
}

function attackMonster(m,index) {
  if (!hero.alive || m.attacking) return;

  const now = performance.now();
  if (now < m.attackCooldownUntil) return;

  m.attackCooldownUntil = now + 450;

  const dmg = getHeroAtk();
  const dealt = damage(m,dmg,m.x,m.y);
  spendPowerTurn();
  flash = `Monster -${dealt}`;

  if (dealt > 0 && hero.vampire > 0) {
    const life = Math.max(1, Math.floor(dealt * hero.vampire * 1.5 / 100));
    hero.hp = Math.min(hero.maxHp, hero.hp + life);
    floatText(120,100,"VAMP +" + life,"#ff4f9a");
  }

  if (hero.poison > 0 && dealt > 0) {
    m.poison += hero.poison;
    flash = `Hit + poison`;
    floatText(m.x,m.y,`POISON +${hero.poison}`,"#7cff4f");
  }

  if (m.hp <= 0) {
    killMonster(index, true);
    return;
  }

  if (now < m.frozenUntil) {
    flash = "Frozen monster cannot counter!";
    return;
  }
  if (m.stone) {
    flash = "Stone monster cannot counter!";
    return;
  }
  if (now < blindUntil) {
    flash = "Blinded monster cannot counter!";
    return;
  }

  m.attacking = true;

  setTimeout(() => {
    const now2 = performance.now();
    if (gameState !== "playing" || !hero.alive || m.hp <= 0) return;

    if (now2 < m.frozenUntil || m.stone || now2 < blindUntil) {
      m.attacking = false;
      return;
    }

    const dmg = Math.max(1, m.atk - getHeroDef());
    damage(hero,dmg,120,100);
    flash = `Hero -${dmg}`;
    m.attacking = false;

    if (hero.hp <= 0) die();
  }, 500);
}

function killMonster(index, giveXp = true) {
  if (!board[index]) return;

  const dead = board[index];
  if (dead.haunted && !dead.ghost) {
    board[index] = makeGhost(dead);
    sound("dead");
    floatText(dead.x, dead.y, "GHOST", "#d8ecff");
    flash = "A ghost rises!";
    return;
  }

  kills++;
  sound("dead");
  floatText(dead.x, dead.y, "KO", "#ffffff");

  if (giveXp) {
    hero.xp += dead.elite ? 3 : 1;
    while (hero.xp >= hero.nextXp) {
      hero.xp -= hero.nextXp;
      levelUp();
    }
  }

  if (kills >= 20) {
    gameState = "win";
    flash = "YOU WIN!";
    sound("level");
    return;
  }

  board[index] = spawnThing();
}

function makeGhost(dead) {
  return {
    ...dead,
    y: dead.y,
    targetY: dead.y,
    hp: Math.max(1, Math.floor(dead.maxHp * .55)),
    maxHp: Math.max(1, Math.floor(dead.maxHp * .55)),
    atk: Math.max(1, Math.floor(dead.atk * .85)),
    stone: dead.stone,
    attackCooldownUntil: 0,
    fightCooldownUntil: 0,
    target: dead.zombie ? null : dead.target,
    ghost: true,
    haunted: false,
    attacking: false,
    vx: (Math.random() - .5) * 2,
    vy: (Math.random() - .5) * 2,
    parts: { ...dead.parts }
  };
}

function levelUp() {
  hero.level++;
  hero.nextXp = Math.floor(hero.nextXp * 1.35 + 1);
  hero.maxHp += 15;
  hero.hp = Math.min(hero.maxHp, hero.hp + 35);
  hero.atk += 2;

  if (hero.level % 2 === 0) hero.def += 1;
  if (hero.level % 3 === 0) hero.poison += 1;

  flash = `LEVEL ${hero.level}!`;
  floatText(W/2, H/2, `LEVEL ${hero.level}!`, "#ffe65c");
  sound("level");
}

function die() {
  hero.alive = false;
  gameState = "dead";
  flash = "YOU DIED";
  sound("dead");
}

function zombieFights() {
  const now = performance.now();
  if (now < blindUntil) return;

  for (const z of board) {
    if (z.type !== "monster" || !z.zombie || now < z.fightCooldownUntil || z.stone) continue;

    let target = null;
    let best = Infinity;

    for (const m of board) {
      if (m.type !== "monster" || m.zombie || now < m.frozenUntil || m.stone) continue;

      const d = dist(z.x,z.y,m.x,m.y);
      if (d < best) {
        best = d;
        target = m;
      }
    }

    z.target = target;

    if (!target) continue;

    const dx = target.x - z.x;
    const dy = target.y - z.y;
    const d = Math.max(1, Math.hypot(dx,dy));

    z.vx += dx / d * .62;
    z.vy += dy / d * .62;

    if (best < z.r + target.r + 70) {
      z.fightCooldownUntil = now + 650;
      target.fightCooldownUntil = now + 650;

      const zdmg = z.atk;
      const mdmg = target.atk;

      target.hp -= zdmg;
      z.hp -= mdmg;

      floatText(target.x,target.y,"-"+zdmg,"#7aff7a");
      floatText(z.x,z.y,"-"+mdmg,"#ff6b6b");
      sound("hit");
    }
  }

  for (let i = board.length - 1; i >= 0; i--) {
    const m = board[i];
    if (m.type === "monster" && m.hp <= 0) {
      killMonster(i, m.zombie ? false : true);
    }
  }
}
