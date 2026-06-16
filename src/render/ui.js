function drawHeroUI() {
  ctx.save();

  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.font = "bold 18px system-ui";
  ctx.fillText(`Room ${currentRoom}  Kills ${kills}/20  LV ${hero.level}  XP ${hero.xp}/${hero.nextXp}`,18,30);
  ctx.fillText(`ATK ${getHeroAtk()}  DEF ${getHeroDef()}  POISON ${hero.poison}`,18,58);

  let status = [];
  if (hero.powerAtkTurns > 0) status.push(`ATK UP ${hero.powerAtkTurns}`);
  if (hero.powerDefTurns > 0) status.push(`DEF UP ${hero.powerDefTurns}`);
  if (hero.regenTicks > 0) status.push(`REGEN ${hero.regenTicks}`);
  if (hero.vampire > 0) status.push(`VAMP ${hero.vampire}%`);
  if (hero.blessed > 0) status.push(`BLESSED ${hero.blessed}`);
  if (hero.rage) status.push("RAGE");
  if (status.length) {
    ctx.font = "bold 14px system-ui";
    ctx.fillStyle = "#ffe65c";
    ctx.fillText(status.join("  "),18,120);
  }

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

  ctx.font = `bold ${Math.min(31,W*.075)}px system-ui`;
  ctx.fillText(flash,W/2,H-35);

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
