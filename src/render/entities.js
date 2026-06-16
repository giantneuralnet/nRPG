function drawMonsterBodyOn(renderCtx, m, x, y, r, shakeAmount = 0) {
  if (m.team === "hero") {
    drawKnightBodyOn(renderCtx, m, x, y, r, shakeAmount);
    return;
  }

  const p = m.parts;
  const now = performance.now();
  const frozen = now < m.frozenUntil;
  const stone = m.stone;

  renderCtx.save();
  renderCtx.translate(x + visualRand(-shakeAmount,shakeAmount), y + visualRand(-shakeAmount,shakeAmount));
  renderCtx.scale(r/75,r/75);
  if (m.ghost) renderCtx.globalAlpha = .68;
  renderCtx.fillStyle = stone ? "#888888" : frozen ? "#72dfff" : m.rage ? "#ff3b3b" : p.color;

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
    renderCtx.fillStyle = stone ? "#aaa" : "#ffd84a";
    renderCtx.beginPath();
    renderCtx.moveTo(-32,-82); renderCtx.lineTo(-16,-112); renderCtx.lineTo(0,-82);
    renderCtx.lineTo(16,-112); renderCtx.lineTo(32,-82); renderCtx.closePath();
    renderCtx.fill();
    renderCtx.strokeStyle = "white"; renderCtx.lineWidth = 4; renderCtx.stroke();
  }

  if (m.blind) {
    renderCtx.strokeStyle = "white";
    renderCtx.lineWidth = 8;
    for (let i=0;i<p.eyes;i++) {
      const ex = (i-(p.eyes-1)/2)*25;
      renderCtx.beginPath();
      renderCtx.moveTo(ex-12,-20);
      renderCtx.lineTo(ex+12,-20);
      renderCtx.stroke();
    }
  } else {
    renderCtx.fillStyle = "white";
    for (let i=0;i<p.eyes;i++) {
      const ex = (i-(p.eyes-1)/2)*25;
      renderCtx.beginPath(); renderCtx.arc(ex,-20,11,0,Math.PI*2); renderCtx.fill();
      renderCtx.fillStyle = m.zombie ? "#111" : "black";
      renderCtx.beginPath(); renderCtx.arc(ex,-20,5,0,Math.PI*2); renderCtx.fill();
      renderCtx.fillStyle = "white";
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

  renderCtx.strokeStyle = stone ? "#666" : frozen ? "#72dfff" : m.rage ? "#ff3b3b" : p.color;
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

function drawKnightBodyOn(renderCtx, k, x, y, r, shakeAmount = 0) {
  const now = performance.now();
  const frozen = now < k.frozenUntil;
  const stone = k.stone;

  renderCtx.save();
  renderCtx.translate(x + visualRand(-shakeAmount,shakeAmount), y + visualRand(-shakeAmount,shakeAmount));
  renderCtx.scale(r/55,r/55);
  if (k.ghost) renderCtx.globalAlpha = .68;

  renderCtx.fillStyle = stone ? "#888888" : frozen ? "#72dfff" : k.zombie ? "#7aff7a" : k.rage ? "#ff3b3b" : "#cfd6e6";
  renderCtx.strokeStyle = "white";
  renderCtx.lineWidth = 5;
  renderCtx.beginPath();
  renderCtx.roundRect(-34,-40,68,80,12);
  renderCtx.fill();
  renderCtx.stroke();

  renderCtx.fillStyle = k.blind ? "#dddddd" : "#6aa8ff";
  renderCtx.beginPath();
  renderCtx.roundRect(-28,-62,56,34,10);
  renderCtx.fill();
  renderCtx.stroke();

  if (k.blind) {
    renderCtx.strokeStyle = "#111";
    renderCtx.lineWidth = 6;
    renderCtx.beginPath();
    renderCtx.moveTo(-18,-45);
    renderCtx.lineTo(18,-45);
    renderCtx.stroke();
  } else {
    renderCtx.fillStyle = "#111";
    renderCtx.fillRect(-18,-48,36,8);
  }

  renderCtx.strokeStyle = stone ? "#666" : "#ffd84a";
  renderCtx.lineWidth = 8;
  renderCtx.beginPath();
  renderCtx.moveTo(34,-6);
  renderCtx.lineTo(70,-42);
  renderCtx.stroke();

  renderCtx.fillStyle = "#9b5a25";
  renderCtx.beginPath();
  renderCtx.moveTo(-36,-6);
  renderCtx.lineTo(-62,10);
  renderCtx.lineTo(-48,48);
  renderCtx.lineTo(-24,26);
  renderCtx.closePath();
  renderCtx.fill();
  renderCtx.strokeStyle = "#d69a55";
  renderCtx.stroke();

  renderCtx.restore();
}

function drawMonster(m) {
  const r = m.r;
  const now = performance.now();
  const frozen = now < m.frozenUntil;
  const stone = m.stone;

  drawMonsterBodyOn(ctx, m, m.x, m.y, r, shake);

  if (m.haunted) {
    ctx.save();
    ctx.translate(m.x + r * .72, m.y - r * .72);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#b987ff";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.fillRect(-r * .18, -r * .18, r * .36, r * .36);
    ctx.strokeRect(-r * .18, -r * .18, r * .36, r * .36);
    ctx.restore();
  }

  if (m.shielded && !m.shieldBroken) {
    const shieldSize = r * 1.55;
    if (!icons.monsterShield && typeof makeIcon === "function") icons.monsterShield = makeIcon("monsterShield");
    if (icons.monsterShield) {
      ctx.drawImage(icons.monsterShield, m.x + r * .45 - shieldSize * .5, m.y - shieldSize * .25, shieldSize, shieldSize);
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
  ctx.fillText(`${m.team === "hero" ? "ALLY " : ""}${stone ? "STONE " : ""}${m.rage ? "RAGE " : ""}${m.blind ? "BLIND " : ""}${m.shielded && !m.shieldBroken ? "SHIELDED " : ""}${m.ghost ? "GHOST " : ""}${m.haunted ? "HAUNTED " : ""}${m.zombie ? "ZOMBIE " : ""}${m.elite ? "ELITE " : ""}ATK ${m.atk}`,m.x,by-4);

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
  if (item.kind === "shield") ctx.fillText(`DEF +${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "potion") ctx.fillText(`HP +${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "regenPotion") ctx.fillText(`REGEN`, item.x, item.y+item.r+10);
  if (item.kind === "vampirePotion") ctx.fillText(`VAMPIRE`, item.x, item.y+item.r+10);
  if (item.kind === "powerPotion") ctx.fillText(`POWER UP`, item.x, item.y+item.r+10);
  if (item.kind === "poison") ctx.fillText(`POISON +${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "bomb") ctx.fillText(`BOMB ${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "clearBomb") ctx.fillText(`CLEAR BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "cleanBomb") ctx.fillText(`CLEAN BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "randomBomb") ctx.fillText(`RANDOM BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "weakenBomb") ctx.fillText(`WEAKEN`, item.x, item.y+item.r+10);
  if (item.kind === "strengthBomb") ctx.fillText(`STRENGTH`, item.x, item.y+item.r+10);
  if (item.kind === "cloudBomb") ctx.fillText(`CLOUDY BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "lightningBomb") ctx.fillText(`LIGHTNING ${item.value}`, item.x, item.y+item.r+10);
  if (item.kind === "poisonBomb") ctx.fillText(`POISON BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "fireBomb") ctx.fillText(`FIRE BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "lavaBomb") ctx.fillText(`LAVA BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "soulBomb") ctx.fillText(`SOUL LINK`, item.x, item.y+item.r+10);
  if (item.kind === "healBomb") ctx.fillText(`HEAL BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "iceBomb") ctx.fillText(`ICE BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "zombieBomb") ctx.fillText(`ZOMBIE BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "shieldBomb") ctx.fillText(`SHIELD BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "stoneBomb") ctx.fillText(`STONE BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "nukeBomb") ctx.fillText(`NUKE`, item.x, item.y+item.r+10);
  if (item.kind === "enrageBomb") ctx.fillText(`ENRAGE`, item.x, item.y+item.r+10);
  if (item.kind === "blindBomb") ctx.fillText(`BLIND BOMB`, item.x, item.y+item.r+10);
  if (item.kind === "stoneScroll") ctx.fillText(`STONE SCROLL`, item.x, item.y+item.r+10);
  if (item.kind === "hauntedScroll") ctx.fillText(`CURSE SCROLL`, item.x, item.y+item.r+10);
  if (item.kind === "blessedScroll") ctx.fillText(`BLESS CURSE`, item.x, item.y+item.r+10);
  if (item.kind === "killRandomItem") ctx.fillText(`KILL RANDOM`, item.x, item.y+item.r+10);
  if (item.kind === "healRandomItem") ctx.fillText(`HEAL RANDOM`, item.x, item.y+item.r+10);
  if (item.kind === "flashBang") ctx.fillText(`FLASH BANG`, item.x, item.y+item.r+10);
  if (item.kind === "exileItem") ctx.fillText(`EXILE`, item.x, item.y+item.r+10);
  if (item.kind === "swapHealthItem") ctx.fillText(`HP SWAP`, item.x, item.y+item.r+10);
  if (item.kind === "chest") ctx.fillText("CHEST", item.x, item.y+item.r+10);

  ctx.restore();
}
