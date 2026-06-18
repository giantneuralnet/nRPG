function drawMonsterBodyOn(renderCtx, m, x, y, r, shakeAmount = 0) {
  const p = m.parts;
  const now = performance.now();
  const frozen = now < m.frozenUntil;
  const stone = m.stone;

  renderCtx.save();
  renderCtx.translate(x + visualRand(-shakeAmount,shakeAmount), y + visualRand(-shakeAmount,shakeAmount));
  renderCtx.scale(r/75,r/75);
  if (m.ghost) renderCtx.globalAlpha = .68;
  const fireFlash = ["#ff4b18","#ff9d3b","#ffd15a"][Math.floor(now / 1000) % 3];
  renderCtx.fillStyle = stone ? "#888888" : frozen ? "#72dfff" : m.combustAt || m.combusting ? fireFlash : m.rage ? "#ff3b3b" : p.color;

  if (p.head === "circle") {
    renderCtx.beginPath(); renderCtx.arc(0,0,70,0,Math.PI*2); renderCtx.fill();
  } else if (p.head === "box") {
    renderCtx.fillRect(-70,-60,140,120);
  } else if (p.head === "triangle") {
    renderCtx.beginPath(); renderCtx.moveTo(0,-85); renderCtx.lineTo(85,70); renderCtx.lineTo(-85,70); renderCtx.closePath(); renderCtx.fill();
  } else {
    renderCtx.beginPath();
    for (let i=0;i<14;i++) {
      const a = i/14*Math.PI*2;
      const rr = 60 + Math.sin(i*3)*18;
      renderCtx.lineTo(Math.cos(a)*rr, Math.sin(a)*rr);
    }
    renderCtx.closePath(); renderCtx.fill();
  }

  if (p.horns) {
    renderCtx.fillStyle = stone ? "#666" : "#eee";
    renderCtx.beginPath(); renderCtx.moveTo(-40,-50); renderCtx.lineTo(-80,-115); renderCtx.lineTo(-8,-70); renderCtx.fill();
    renderCtx.beginPath(); renderCtx.moveTo(40,-50); renderCtx.lineTo(80,-115); renderCtx.lineTo(8,-70); renderCtx.fill();
  }

  if (m.elite) {
    renderCtx.fillStyle = stone ? "#aaa" : m.ultraElite ? "#ff4f4f" : "#ffd84a";
    renderCtx.beginPath();
    renderCtx.moveTo(-32,-82); renderCtx.lineTo(-16,-112); renderCtx.lineTo(0,-82);
    renderCtx.lineTo(16,-112); renderCtx.lineTo(32,-82); renderCtx.closePath();
    renderCtx.fill();
    renderCtx.strokeStyle = m.ultraElite ? "#ffe65c" : "white"; renderCtx.lineWidth = 4; renderCtx.stroke();
  }

  if (m.blind) {
    renderCtx.strokeStyle = m.combustAt || m.combusting ? "#ff9d3b" : m.haunted ? "#b987ff" : "white";
    renderCtx.lineWidth = 8;
    for (let i=0;i<p.eyes;i++) {
      const ex = (i-(p.eyes-1)/2)*25;
      renderCtx.beginPath();
      renderCtx.moveTo(ex-12,-20);
      renderCtx.lineTo(ex+12,-20);
      renderCtx.stroke();
    }
  } else {
    const eyeColor = m.combustAt || m.combusting ? "#ff9d3b" : m.haunted ? "#b987ff" : "white";
    renderCtx.fillStyle = eyeColor;
    for (let i=0;i<p.eyes;i++) {
      const ex = (i-(p.eyes-1)/2)*25;
      renderCtx.beginPath(); renderCtx.arc(ex,-20,11,0,Math.PI*2); renderCtx.fill();
      renderCtx.fillStyle = m.combustAt || m.combusting || m.haunted ? "white" : m.zombie ? "#111" : "black";
      renderCtx.beginPath(); renderCtx.arc(ex,-20,5,0,Math.PI*2); renderCtx.fill();
      renderCtx.fillStyle = eyeColor;
    }
  }

  if (p.mouth === "smile") {
    renderCtx.strokeStyle = "black"; renderCtx.lineWidth = 6;
    renderCtx.beginPath(); renderCtx.arc(0,15,30,0,Math.PI); renderCtx.stroke();
  }
  if (p.mouth === "fangs") {
    renderCtx.fillStyle = "black"; renderCtx.fillRect(-35,20,70,16);
    renderCtx.fillStyle = "white";
    renderCtx.beginPath(); renderCtx.moveTo(-20,20); renderCtx.lineTo(-8,52); renderCtx.lineTo(3,20); renderCtx.fill();
    renderCtx.beginPath(); renderCtx.moveTo(20,20); renderCtx.lineTo(8,52); renderCtx.lineTo(-3,20); renderCtx.fill();
  }
  if (p.mouth === "void") {
    renderCtx.fillStyle = "black";
    renderCtx.beginPath(); renderCtx.arc(0,25,25,0,Math.PI*2); renderCtx.fill();
  }

  renderCtx.strokeStyle = stone ? "#666" : frozen ? "#72dfff" : m.combustAt || m.combusting ? fireFlash : m.rage ? "#ff3b3b" : p.color;
  renderCtx.lineWidth = 10;

  for (let i=0;i<p.arms;i++) {
    const side = i%2 ? 1 : -1;
    renderCtx.beginPath();
    renderCtx.moveTo(side*55,18);
    renderCtx.lineTo(side*115,visualRand(-20,65));
    renderCtx.stroke();
  }

  for (let i=0;i<p.legs;i++) {
    const lx = (i-(p.legs-1)/2)*21;
    renderCtx.beginPath();
    renderCtx.moveTo(lx,58);
    renderCtx.lineTo(lx+visualRand(-10,10),112);
    renderCtx.stroke();
  }

  renderCtx.restore();
}

function drawMonster(m) {
  const r = m.r;
  const now = performance.now();
  const frozen = now < m.frozenUntil;
  const stone = m.stone;
  const shieldCount = m.shieldCount || (m.shielded && !m.shieldBroken ? 1 : 0);

  drawMonsterBodyOn(ctx, m, m.x, m.y, r, shake);

  if (m.charge > 0) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,245,100,.9)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    const count = Math.min(8, 3 + m.charge);
    for (let i = 0; i < count; i++) {
      const a = now * .006 + i * Math.PI * 2 / count;
      const inner = r * (.8 + (i % 2) * .12);
      const outer = r * (1.35 + (i % 3) * .16);
      ctx.beginPath();
      ctx.moveTo(m.x + Math.cos(a) * inner, m.y + Math.sin(a) * inner);
      ctx.lineTo(m.x + Math.cos(a + Math.sin(now * .01 + i) * .25) * outer, m.y + Math.sin(a + Math.cos(now * .008 + i) * .25) * outer);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (m.contagious) {
    ctx.save();
    ctx.strokeStyle = "#57ff75";
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 7]);
    ctx.beginPath();
    ctx.arc(m.x,m.y,r * 1.14,0,Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }

  if (m.echoDamage) {
    ctx.save();
    ctx.strokeStyle = "#72dfff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(m.x,m.y,r * 1.28,0,Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }

  if (shieldCount > 0) {
    const shieldSize = r * 1.55;
    if (!icons.monsterShield && typeof makeIcon === "function") icons.monsterShield = makeIcon("monsterShield");
    if (icons.monsterShield) {
      ctx.drawImage(icons.monsterShield, m.x + r * .45 - shieldSize * .5, m.y - shieldSize * .25, shieldSize, shieldSize);
    }
    if (shieldCount > 1) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `bold ${Math.max(13, r * .42)}px system-ui`;
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(40,22,10,.9)";
      ctx.fillStyle = "#fff3d0";
      ctx.strokeText(`${shieldCount}`, m.x + r * .45, m.y + r * .13);
      ctx.fillText(`${shieldCount}`, m.x + r * .45, m.y + r * .13);
      ctx.restore();
    }
  }

  ctx.save();

  const barW = r*2.1;
  const barH = 9;
  const bx = m.x-barW/2;
  const by = m.y-r-32;

  ctx.fillStyle = "#222";
  ctx.fillRect(bx,by,barW,barH);
  ctx.fillStyle = stone ? "#bbbbbb" : m.team === "hero" ? "#d8ecff" : m.ghost ? "#d8ecff" : m.zombie ? "#7aff7a" : "#e84444";
  ctx.fillRect(bx,by,barW*Math.max(0,m.hp/m.maxHp),barH);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.strokeRect(bx,by,barW,barH);

  if (m.poison > 0) {
    ctx.fillStyle = "#7cff4f";
    ctx.fillRect(bx,by+barH+3,barW*Math.min(1,m.poison/30),5);
  }

  if (m.fire > 0) {
    ctx.fillStyle = "#ff7a2f";
    ctx.fillRect(bx,by+barH+10,barW*Math.min(1,m.fire/30),5);
  }

  if (frozen) {
    ctx.fillStyle = "#72dfff";
    ctx.fillRect(bx,by+barH+17,barW*Math.max(0,(m.frozenUntil-now)/4000),5);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.font = "bold 14px system-ui";
  ctx.fillStyle = "white";
  const combustText = m.combusting ? "COMBUST " : m.combustAt ? `BURN ${Math.max(0, Math.ceil((m.combustAt - performance.now()) / 1000))} ` : "";
  ctx.fillText(`${m.boss ? "BOSS " : ""}${m.team === "hero" ? "ALLY " : ""}${stone ? "STONE " : ""}${combustText}${m.rage ? "RAGE " : ""}${m.blind ? "BLIND " : ""}${m.contagious ? "CONTAGIOUS " : ""}${m.echoDamage ? "SHOCK " : ""}${m.charge > 0 ? `CHARGE ${m.charge} ` : ""}${shieldCount > 0 ? "SHIELDED " : ""}${m.ghost ? "GHOST " : ""}${m.haunted ? "HAUNTED " : ""}${m.zombie ? "ZOMBIE " : ""}${m.ultraElite ? "ULTRA " : m.elite ? "ELITE " : ""}ATK ${m.atk}`,m.x,by-4);

  if (m.attacking) {
    ctx.fillStyle = "#ff6666";
    ctx.fillText("attacking...",m.x,m.y+m.r+28);
  }

  ctx.restore();
}

function drawDoorOn(renderCtx, door) {
  renderCtx.save();
  const w = door.r * 1.45;
  const h = door.r * 2.15;
  const x = door.x - w / 2;
  const y = door.y - h / 2;

  renderCtx.fillStyle = "#6b3f24";
  renderCtx.strokeStyle = "white";
  renderCtx.lineWidth = 4;
  renderCtx.beginPath();
  renderCtx.roundRect(x,y,w,h,8);
  renderCtx.fill();
  renderCtx.stroke();

  renderCtx.fillStyle = "#ffd84a";
  renderCtx.beginPath();
  renderCtx.arc(door.x + w * .28, door.y, 5, 0, Math.PI * 2);
  renderCtx.fill();

  renderCtx.fillStyle = "white";
  renderCtx.textAlign = "center";
  renderCtx.textBaseline = "middle";
  const label = `${door.room}`;
  renderCtx.font = `bold ${Math.floor(door.r * (label.length > 2 ? .55 : .9))}px system-ui`;
  renderCtx.fillText(label, door.x, door.y - door.r * .2);
  renderCtx.restore();
}

function drawDoor(door) {
  drawDoorOn(ctx, door);

  ctx.save();
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.font = "bold 15px system-ui";
  ctx.fillText(`ROOM ${door.room}`, door.x, door.y + door.r + 10);
  ctx.restore();
}

function drawItem(item) {
  ctx.save();

  const size = item.r*2.1;
  if (!icons[item.kind] && typeof makeIcon === "function") icons[item.kind] = makeIcon(item.kind);
  if (icons[item.kind]) {
    ctx.drawImage(icons[item.kind], item.x-size/2, item.y-size/2, size, size);
  } else {
    ctx.fillStyle = "#d8ecff";
    ctx.beginPath();
    ctx.arc(item.x,item.y,item.r,0,Math.PI*2);
    ctx.fill();
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "bold 15px system-ui";
  ctx.fillStyle = "white";

  if (item.kind === "sword") ctx.fillText(`ATK +${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "shield") ctx.fillText(`DEFENSE +${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "potion") ctx.fillText(`HP +${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "regenPotion") ctx.fillText(`REGEN`, item.x, item.y+item.r+10);
  if (item.kind === "vampirePotion") ctx.fillText(`VAMPIRE`, item.x, item.y+item.r+10);
  if (item.kind === "moltenPotion") ctx.fillText(`MOLTEN`, item.x, item.y+item.r+10);
  if (item.kind === "dodgePotion") ctx.fillText(`DODGE`, item.x, item.y+item.r+10);
  if (item.kind === "critPotion") ctx.fillText(`CRIT`, item.x, item.y+item.r+10);
  if (item.kind === "surprisePotion") ctx.fillText(`SURPRISE`, item.x, item.y+item.r+10);
  if (item.kind === "decayCurse") ctx.fillText(`DECAY`, item.x, item.y+item.r+10);
  if (item.kind === "phoenixPotion") ctx.fillText(`PHOENIX`, item.x, item.y+item.r+10);
  if (item.kind === "confusionCurse") ctx.fillText(`CONFUSED`, item.x, item.y+item.r+10);
  if (item.kind === "glitchCurse") ctx.fillText(`GLITCH`, item.x, item.y+item.r+10);
  if (item.kind === "luckyCharm") ctx.fillText(`LUCKY`, item.x, item.y+item.r+10);
  if (item.kind === "unluckyCurse") ctx.fillText(`UNLUCKY`, item.x, item.y+item.r+10);
  if (item.kind === "gunpowder") ctx.fillText(`GUNPOWDER`, item.x, item.y+item.r+10);
  if (item.kind === "multiplyStatus") ctx.fillText(`MULTIPLY`, item.x, item.y+item.r+10);
  if (item.kind === "triggerStatus") ctx.fillText(`TRIGGER`, item.x, item.y+item.r+10);
  if (item.kind === "maxHealthUp") ctx.fillText(`MAX HP +${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "maxHealthDown") ctx.fillText(`MAX HP -${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "prayerBook") ctx.fillText(`PRAYER`, item.x, item.y+item.r+10);
  if (item.kind === "banishBook") ctx.fillText(`BANISH`, item.x, item.y+item.r+10);
  if (item.kind === "powerPotion") ctx.fillText(`POWER UP`, item.x, item.y+item.r+10);
  if (item.kind === "poison") ctx.fillText(`POISON +${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "bomb") ctx.fillText(`BOMB ${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "clearBomb") ctx.fillText(`CLEAR BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "cleanBomb") ctx.fillText(`CLEAN BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "randomBomb") ctx.fillText(`RANDOM BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "weakenBomb") ctx.fillText(`WEAKEN`, item.x, item.y+item.r+10);
  if (item.kind === "strengthBomb") ctx.fillText(`STRENGTH`, item.x, item.y+item.r+10);
  if (item.kind === "cloudBomb") ctx.fillText(`CLOUDY BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "lightningBomb") ctx.fillText(`CHARGE`, item.x, item.y+item.r+10);
  if (item.kind === "poisonBomb") ctx.fillText(`POISON BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "fireBomb") ctx.fillText(`FIRE BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "lavaBomb") ctx.fillText(`LAVA BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "contagionBomb") ctx.fillText(`CONTAGION`, item.x, item.y+item.r+10);
  if (item.kind === "echoBomb") ctx.fillText(`SHOCKWAVE`, item.x, item.y+item.r+10);
  if (item.kind === "soulBomb") ctx.fillText(`SOUL LINK`, item.x, item.y+item.r+10);
  if (item.kind === "healBomb") ctx.fillText(`HEAL BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "iceBomb") ctx.fillText(`ICE BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "zombieScroll") ctx.fillText(`ZOMBIE SCROLL`, item.x, item.y+item.r+10);
  if (item.kind === "shieldBomb") ctx.fillText(`SHIELD BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "stoneBomb") ctx.fillText(`STONE BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "nukeBomb") ctx.fillText(`NUKE`, item.x, item.y+item.r+10);
  if (item.kind === "enrageBomb") ctx.fillText(`ENRAGE`, item.x, item.y+item.r+10);
  if (item.kind === "blindBomb") ctx.fillText(`BLIND BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "stoneScroll") ctx.fillText(`STONE SCROLL`, item.x, item.y+item.r+10);
  if (item.kind === "hauntedScroll") ctx.fillText(`CURSE SCROLL`, item.x, item.y+item.r+10);
  if (item.kind === "blessedScroll") ctx.fillText(`BLESS CURSE`, item.x, item.y+item.r+10);
  if (item.kind === "necroticScroll") ctx.fillText(`NECROTIC`, item.x, item.y+item.r+10);
  if (item.kind === "allyScroll") ctx.fillText(`ALLY SCROLL`, item.x, item.y+item.r+10);
  if (item.kind === "combustionScroll") ctx.fillText(`COMBUST`, item.x, item.y+item.r+10);
  if (item.kind === "killRandomItem") ctx.fillText(`KILL RANDOM`, item.x, item.y+item.r+10);
  if (item.kind === "healRandomItem") ctx.fillText(`HEAL RANDOM`, item.x, item.y+item.r+10);
  if (item.kind === "flashBang") ctx.fillText(`FLASH BANG`, item.x, item.y+item.r+10);
  if (item.kind === "exileItem") ctx.fillText(`EXILE`, item.x, item.y+item.r+10);
  if (item.kind === "swapHealthItem") ctx.fillText(`HP SWAP`, item.x, item.y+item.r+10);
  if (item.kind === "chest") ctx.fillText("CHEST", item.x, item.y+item.r+10);

  ctx.restore();
}
