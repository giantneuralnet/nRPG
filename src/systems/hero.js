function getHeroAtk() {
  return hero.atk + (hero.powerAtkTurns > 0 ? hero.powerAtkBonus : 0);
}

function getHeroDef() {
  return hero.def + (hero.powerDefTurns > 0 ? hero.powerDefBonus : 0);
}

function spendPowerTurn() {
  if (hero.powerAtkTurns > 0) {
    hero.powerAtkTurns--;
    if (hero.powerAtkTurns <= 0) floatText(120,120,"ATK power faded","#ffd84a");
  }
  if (hero.powerDefTurns > 0) {
    hero.powerDefTurns--;
    if (hero.powerDefTurns <= 0) floatText(120,145,"DEF power faded","#85bdff");
  }
}

function findSoulLinkedTarget(target) {
  if (!soulLinks || target.type !== "monster") return null;
  for (const link of soulLinks) {
    if (link.a === target && board.includes(link.b) && link.b.hp > 0) return link.b;
    if (link.b === target && board.includes(link.a) && link.a.hp > 0) return link.a;
  }
  return null;
}

function damage(target, amount, x, y, color="#ff6b6b", useParticles = false, splitSoul = true) {
  amount = Math.max(0, Math.floor(amount));

  if (target === hero && hero.dodge > 0 && rng() < Math.min(.75, hero.dodge / 100)) {
    floatText(x, y, "DODGE", "#72dfff");
    sound("hit");
    return 0;
  }

  if (splitSoul && amount > 0) {
    const linked = findSoulLinkedTarget(target);
    if (linked) {
      const targetAmount = Math.ceil(amount / 2);
      const linkedAmount = Math.floor(amount / 2);
      const dealtTarget = damage(target, targetAmount, x, y, color, useParticles, false);
      const dealtLinked = linkedAmount > 0 ? damage(linked, linkedAmount, linked.x, linked.y, "#ff3333", useParticles, false) : 0;
      return dealtTarget + dealtLinked;
    }
  }

  if (target.type === "monster" && target.ghost && rng() < .5) {
    floatText(x, y, "DODGE", "#d8ecff");
    sound("hit");
    return 0;
  }

  if (target.type === "monster" && target.stone) {
    floatText(x, y, "STONE", "#bbbbbb");
    if (useParticles) burst(x,y,"#bbbbbb",8,3);
    sound("hit");
    return 0;
  }

  if (target.type === "monster" && absorbShield(target, x, y, useParticles)) {
    return 0;
  }

  target.hp -= amount;
  shake = 7;
  sound("hit");
  floatText(x, y, "-" + amount, color);
  if (useParticles) burst(x,y,color,12,5);
  return amount;
}

function absorbShield(target, x, y, useParticles = false) {
  if (target.shielded && !target.shieldBroken) {
    target.shieldBroken = true;
    floatText(x, y, "SHIELD", "#85bdff");
    if (useParticles) burst(x,y,"#d69a55",12,4);
    sound("hit");
    return true;
  }
  return false;
}

function heal(target, amount, x, y) {
  amount = Math.max(0, Math.floor(amount));
  target.hp = Math.min(target.maxHp, target.hp + amount);
  sound("item");
  floatText(x, y, "+" + amount, "#70ff8a");
  burst(x,y,"#70ff8a",14,4);
}
