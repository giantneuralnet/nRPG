function drawHeroUI() {
  ctx.save();

  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.font = "bold 18px system-ui";
  ctx.fillText(`Room ${currentRoom}  Kills ${Math.min(kills,20)}/20  Boss ${bossDefeated ? 1 : 0}/1`,18,30);
  ctx.fillText(`LV ${hero.level}  XP ${hero.xp}/${hero.nextXp}  ATK ${getHeroAtk()}  DEF ${getHeroDef()}`,18,58);

  const bw = Math.min(360,W-36);
  ctx.fillStyle = "#333";
  ctx.fillRect(18,76,bw,24);
  ctx.fillStyle = "#e84444";
  ctx.fillRect(18,76,bw*Math.max(0,hero.hp/hero.maxHp),24);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.strokeRect(18,76,bw,24);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "14px system-ui";
  ctx.fillText(`HP ${Math.max(0,hero.hp)} / ${hero.maxHp}`,18+bw/2,94);

  drawHeroStatuses(18,120);

  ctx.font = `bold ${Math.min(31,W*.075)}px system-ui`;
  ctx.fillText(flash,W/2,H-35);

  ctx.restore();
}

function drawHeroStatuses(x,y) {
  const statuses = [];
  if (hero.poison > 0) statuses.push(["POISON " + hero.poison, "#7cff4f"]);
  if (hero.vampire > 0) statuses.push(["VAMP " + hero.vampire + "%", "#ff4f9a"]);
  if (hero.regenTicks > 0) statuses.push(["REGEN " + hero.regenTicks, "#40ff96"]);
  if (hero.powerAtkTurns > 0) statuses.push(["ATK UP " + hero.powerAtkTurns, "#ffd84a"]);
  if (hero.powerDefTurns > 0) statuses.push(["DEF UP " + hero.powerDefTurns, "#85bdff"]);
  if (hero.blessed > 0) statuses.push(["BLESSED " + hero.blessed, "#ffe65c"]);
  if (hero.molten > 0) statuses.push(["MOLTEN " + hero.molten, "#ff7a2f"]);
  if (hero.dodge > 0) statuses.push(["DODGE " + hero.dodge + "%", "#72dfff"]);
  if (hero.crit > 0) statuses.push(["CRIT " + hero.crit + "%", "#ffe65c"]);
  if (hero.surprise > 0) statuses.push(["SURPRISE " + hero.surprise, "#ffffff"]);
  if (hero.decay > 0) statuses.push(["DECAY " + hero.decay, "#8f6bff"]);
  if (hero.phoenix > 0) statuses.push(["PHOENIX " + hero.phoenix, "#ff9d3b"]);
  if (hero.confused > 0) statuses.push(["CONFUSED " + hero.confused, "#c86bff"]);
  if (hero.glitched > 0) statuses.push(["GLITCHED " + hero.glitched, "#65d7ff"]);
  if (hero.lucky > 0) statuses.push(["LUCKY " + hero.lucky, "#70ff8a"]);
  if (hero.unlucky > 0) statuses.push(["UNLUCKY " + hero.unlucky, "#bbbbbb"]);
  if (hero.gunpowder > 0) statuses.push(["GUNPOWDER " + hero.gunpowder, "#ffcf4f"]);
  if (hero.multiply > 1) statuses.push(["MULTIPLY " + hero.multiply, "#ffe65c"]);
  if (hero.trigger > 0) statuses.push(["TRIGGER " + hero.trigger, "#d8ecff"]);
  if (hero.prayers && hero.prayers.length) {
    while (hero.prayers.length && hero.prayers[hero.prayers.length - 1].remaining <= 0) hero.prayers.pop();
    for (let i = 0; i < hero.prayers.length; i++) {
      const prayer = hero.prayers[i];
      const active = i === hero.prayers.length - 1;
      statuses.push(["Pray " + itemDisplayName(prayer.kind) + ": " + prayer.remaining, active ? "#ffffff" : "#d8ecff"]);
    }
  }
  if (hero.rage) statuses.push(["RAGE", "#ff3b3b"]);
  if (!statuses.length) return;

  ctx.save();
  ctx.font = "bold 14px system-ui";
  ctx.textAlign = "left";
  let cx = x;
  let cy = y;
  for (const [text,color] of statuses) {
    const w = ctx.measureText(text).width + 14;
    if (cx + w > W - 18) {
      cx = x;
      cy += 18;
    }
    ctx.fillStyle = color;
    ctx.fillText(text,cx,cy);
    cx += w;
  }
  ctx.restore();
}
function drawFloats() {
  ctx.save();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const f of floats) {
    const alpha = Math.max(0, f.life / f.maxLife);
    const scale = 1 + Math.sin((1 - alpha) * Math.PI) * .25;

    ctx.globalAlpha = alpha;
    ctx.font = `bold ${Math.floor(34 * scale)}px system-ui`;
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.fillStyle = f.color;
    ctx.strokeText(f.text, f.x, f.y);
    ctx.fillText(f.text, f.x, f.y);
  }

  ctx.restore();
}

function drawClouds() {
  if (!clouds || clouds.length <= 0) return;

  ctx.save();
  const cloud = clouds[0];
  const maxHits = Math.max(1, cloud.maxHits || cloud.hits || 1);
  const progress = Math.max(0, Math.min(1, 1 - cloud.hits / maxHits));
  const shade = Math.floor(45 + progress * 210);
  ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle = shade > 150 ? "rgba(20,20,20,.9)" : "rgba(255,255,255,.9)";
  ctx.strokeStyle = shade > 150 ? "rgba(255,255,255,.75)" : "rgba(20,20,20,.75)";
  ctx.lineWidth = 4;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${Math.min(28, Math.max(20, W * .055))}px system-ui`;
  ctx.strokeText("Tap to clear clouds", W/2, H/2 - 46);
  ctx.fillText("Tap to clear clouds", W/2, H/2 - 46);
  ctx.font = "bold 42px system-ui";
  ctx.strokeText(`${cloud.hits}`, W/2, H/2 + 8);
  ctx.fillText(`${cloud.hits}`, W/2, H/2 + 8);
  ctx.restore();
}

function drawLavaPools() {
  if (!lavaPools || lavaPools.length <= 0) return;

  ctx.save();
  for (const l of lavaPools) {
    const alpha = Math.max(.18, Math.min(.75, l.life / 620));
    ctx.fillStyle = `rgba(255,92,20,${alpha})`;
    ctx.strokeStyle = `rgba(255,185,55,${Math.min(.9, alpha + .2)})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(l.x,l.y,l.r,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawSoulLinks() {
  if (!soulLinks || soulLinks.length <= 0) return;

  ctx.save();
  ctx.strokeStyle = "rgba(255,45,45,.82)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  for (const link of soulLinks) {
    const a = link.a;
    const b = link.b;
    if (!a || !b || !board.includes(a) || !board.includes(b)) continue;
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2 + Math.min(120, Math.max(35, dist(a.x,a.y,b.x,b.y) * .18));
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.quadraticCurveTo(midX,midY,b.x,b.y);
    ctx.stroke();

    ctx.fillStyle = "#ff3333";
    ctx.beginPath();
    ctx.arc(a.x,a.y,6,0,Math.PI*2);
    ctx.arc(b.x,b.y,6,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}
