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

function damage(target, amount, x, y, color="#ff6b6b") {
  amount = Math.max(0, Math.floor(amount));

  if (target.type === "monster" && performance.now() < target.stoneUntil) {
    floatText(x, y, "STONE", "#bbbbbb");
    sound("hit");
    return 0;
  }

  target.hp -= amount;
  shake = 7;
  sound("hit");
  floatText(x, y, "-" + amount, color);
  return amount;
}

function heal(target, amount, x, y) {
  amount = Math.max(0, Math.floor(amount));
  target.hp = Math.min(target.maxHp, target.hp + amount);
  sound("item");
  floatText(x, y, "+" + amount, "#70ff8a");
}
