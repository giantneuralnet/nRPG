function statusTick() {
  if (gameState !== "playing") return;

  if (hero.regenTicks > 0) {
    const amount = Math.max(1, Math.floor(hero.regenPower * 1.25));
    heal(hero, amount, 120, 100);
    hero.regenTicks--;
    if (hero.regenTicks <= 0) hero.regenPower = 0;
  }

  for (let i = board.length - 1; i >= 0; i--) {
    const m = board[i];
    if (m.type !== "monster") continue;

    if (m.stone && (m.poison > 0 || m.fire > 0)) {
      floatText(m.x, m.y, "STONE", "#bbbbbb");
      continue;
    }

    if (m.poison > 0) {
      const dmg = m.poison;
      m.poison = Math.max(0, m.poison - 1);
      damage(m, dmg, m.x, m.y, "#7cff4f", true);
    }

    if (m.fire > 0 && m.hp > 0) {
      const dmg = m.fire + 2;
      m.fire = Math.max(0, m.fire - 1);
      damage(m, dmg, m.x, m.y, "#ff7a2f", true);
    }

    if (m.hp <= 0) {
      killMonster(i, m.team !== "hero");
    }
  }

  for (let i = lavaPools.length - 1; i >= 0; i--) {
    const pool = lavaPools[i];
    for (let j = board.length - 1; j >= 0; j--) {
      const t = board[j];
      if (t.type !== "monster") continue;
      if (t.stone) continue;
      if (dist(t.x,t.y,pool.x,pool.y) > pool.r + t.r * .65) continue;
      damage(t, pool.damage, t.x, t.y, "#ff7a2f", true);
      if (t.hp <= 0) {
        killMonster(j, t.team !== "hero");
      }
    }
  }
}

function attackMonster(m,index) {
  if (!hero.alive || m.attacking) return;
  if (m.team === "hero") {
    flash = "Ally is on your side!";
    return;
  }

  const now = performance.now();
  if (now < m.attackCooldownUntil) return;

  m.attackCooldownUntil = now + 260;

  const dmg = getHeroAtk();
  const dealt = damage(m,dmg,m.x,m.y);
  setAllyTargets(m);
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

    const target = pickCounterTarget(m);
    const dmg = Math.max(1, m.atk - (target === hero ? getHeroDef() : 0));
    damage(target,dmg,target === hero ? 120 : target.x,target === hero ? 100 : target.y);
    flash = target === hero ? `Hero -${dmg}` : `Wild counter!`;
    m.attacking = false;

    if (hero.hp <= 0) die();
  }, 500);
}

function killMonster(index, giveXp = true) {
  if (!board[index]) return;

  const dead = board[index];
  if (dead.team === "hero") {
    sound("dead");
    floatText(dead.x, dead.y, "DOWN", "#d8ecff");
    burst(dead.x,dead.y,"#d8ecff",14,5);
    board[index] = spawnThing();
    return;
  }

  if (dead.haunted && !dead.ghost) {
    board[index] = makeGhost(dead);
    sound("dead");
    floatText(dead.x, dead.y, "GHOST", "#d8ecff");
    burst(dead.x,dead.y,"#ff4f4f",18,5);
    flash = "A ghost rises!";
    return;
  }

  kills++;
  sound("dead");
  floatText(dead.x, dead.y, "KO", "#ff4f4f");
  burst(dead.x,dead.y,"#ff4f4f",18,6);

  if (hero.blessed > 0) {
    const amount = Math.max(1, Math.floor(hero.maxHp * .12));
    hero.hp = Math.min(hero.maxHp, hero.hp + amount);
    floatText(120,100,"BLESS +" + amount,"#ffe65c");
  }

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
    blind: dead.blind,
    rage: dead.rage,
    attacking: false,
    vx: (rng() - .5) * 2,
    vy: (rng() - .5) * 2,
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
  burst(W/2,H/2,"#ffe65c",24,7);
  sound("level");
}

function die() {
  hero.alive = false;
  gameState = "dead";
  flash = "YOU DIED";
  sound("dead");
}

function checkStoneLock() {
  if (gameState !== "playing") return;
  const monsters = board.filter(t => t.type === "monster");
  const hasItems = board.some(t => t.type === "item");
  if (monsters.length > 0 && !hasItems && monsters.every(m => m.stone)) {
    hero.alive = false;
    gameState = "dead";
    flash = "STONE LOCK";
    sound("dead");
  }
}

function zombieFights() {
  const now = performance.now();
  if (now < blindUntil) return;

  for (const z of board) {
    if (z.type !== "monster" || !(z.zombie || z.rage) || now < z.fightCooldownUntil || z.stone) continue;

    let target = null;
    let best = Infinity;

    for (const m of board) {
      if (m.type !== "monster" || m === z || m.team === z.team || (!z.rage && m.zombie) || now < m.frozenUntil || m.stone) continue;

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
      damage(target, zdmg, target.x, target.y, "#7aff7a");
      damage(z, target.atk, z.x, z.y, "#ff6b6b");
    }
  }

  for (let i = board.length - 1; i >= 0; i--) {
    const m = board[i];
    if (m.type === "monster" && m.hp <= 0) {
      killMonster(i, m.zombie ? false : true);
    }
  }
}

function setAllyTargets(target) {
  for (const k of board) {
    if (k.type === "monster" && k.team === "hero") k.target = target;
  }
}

function pickCounterTarget(attacker) {
  if (!attacker.blind) return hero;
  const targets = [hero, ...board.filter(t => t !== attacker && t.type === "monster")];
  return pick(targets);
}

function allyFights() {
  const now = performance.now();
  for (const k of board) {
    if (k.type !== "monster" || k.team !== "hero") continue;
    if (k.stone || now < k.frozenUntil) continue;
    if (k.rage && (!k.target || k.target.hp <= 0 || !board.includes(k.target))) {
      let nearest = null;
      let best = Infinity;
      for (const m of board) {
        if (m.type !== "monster" || m.team === k.team || m.stone) continue;
        const d = dist(k.x,k.y,m.x,m.y);
        if (d < best) {
          best = d;
          nearest = m;
        }
      }
      k.target = nearest;
    }
    if (!k.target || k.target.hp <= 0 || !board.includes(k.target)) {
      k.target = null;
      continue;
    }

    const target = k.target;
    const dx = target.x - k.x;
    const dy = target.y - k.y;
    const d = Math.max(1, Math.hypot(dx,dy));
    k.vx += dx / d * .58;
    k.vy += dy / d * .58;
    k.vx = Math.max(-2.8, Math.min(2.8, k.vx));
    k.vy = Math.max(-2.8, Math.min(2.8, k.vy));
    k.x += k.vx;
    k.y += k.vy;

    if (d < k.r + target.r + 42 && now >= k.attackCooldownUntil) {
      k.attackCooldownUntil = now + 720;
      const dealt = damage(target, k.atk, target.x, target.y, "#d8ecff");
      if (target.hp <= 0) {
        const index = board.indexOf(target);
        if (index >= 0) killMonster(index, true);
        k.target = null;
      } else if (dealt <= 0) {
        k.target = null;
      }
    }
  }
}
