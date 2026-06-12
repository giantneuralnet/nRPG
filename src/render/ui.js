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
  for (const c of clouds) {
    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}
