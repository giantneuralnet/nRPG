function drawHeroUI() {
  ctx.save();

  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.font = "bold 18px system-ui";
  ctx.fillText(`Kills ${kills}/20  LV ${hero.level}  XP ${hero.xp}/${hero.nextXp}`,18,30);
  ctx.fillText(`ATK ${getHeroAtk()}  DEF ${getHeroDef()}  POISON ${hero.poison}`,18,58);

  let status = [];
  if (hero.powerAtkTurns > 0) status.push(`ATK UP ${hero.powerAtkTurns}`);
  if (hero.powerDefTurns > 0) status.push(`DEF UP ${hero.powerDefTurns}`);
  if (hero.regenTicks > 0) status.push(`REGEN ${hero.regenTicks}`);
  if (hero.vampire > 0) status.push(`VAMP ${hero.vampire}%`);
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
    ctx.fillStyle = "rgba(225,232,245,.96)";
    ctx.strokeStyle = "rgba(255,255,255,.95)";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
    for (const b of c.bumps) {
      ctx.moveTo(c.x + Math.cos(b.a)*c.r*b.d + b.r, c.y + Math.sin(b.a)*c.r*b.d);
      ctx.arc(c.x + Math.cos(b.a)*c.r*b.d, c.y + Math.sin(b.a)*c.r*b.d, b.r,0,Math.PI*2);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#556";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 22px system-ui";
    ctx.fillText("tap cloud", c.x, c.y);
  }
  ctx.restore();
}

function menuButton(x,y,w,h,text,selected=false) {
  ctx.fillStyle = selected ? "#ffd84a" : "#eee";
  ctx.fillRect(x,y,w,h);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(x,y,w,h);

  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${Math.min(24,W*.05)}px system-ui`;
  ctx.fillText(text,x+w/2,y+h/2);

  menuButtons.push({x,y,w,h,text});
}

function drawMenu(title, subtitle, button) {
  ctx.save();
  menuButtons = [];

  ctx.fillStyle = "rgba(0,0,0,.78)";
  ctx.fillRect(0,0,W,H);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = `bold ${Math.min(50,W*.105)}px system-ui`;
  ctx.fillText(title,W/2,H*.17);

  ctx.font = `${Math.min(18,W*.04)}px system-ui`;
  ctx.fillText(subtitle,W/2,H*.23);

  ctx.font = `bold ${Math.min(24,W*.05)}px system-ui`;
  ctx.fillText(`N = number of choices: ${settings.choices}`, W/2, H*.32);

  const small = 58;
  const gap = 18;
  const cy = H*.36;
  menuButton(W/2 - small - gap, cy, small, 52, "-");
  menuButton(W/2 + gap, cy, small, 52, "+");

  ctx.fillStyle = "white";
  ctx.font = `bold ${Math.min(23,W*.05)}px system-ui`;
  ctx.fillText("Difficulty", W/2, H*.50);

  const bw = Math.min(120,W*.26);
  const bh = 54;
  const y = H*.54;
  const total = bw*3 + 18*2;
  const sx = W/2 - total/2;

  menuButton(sx, y, bw, bh, "easy", settings.difficulty === "easy");
  menuButton(sx + bw + 18, y, bw, bh, "normal", settings.difficulty === "normal");
  menuButton(sx + bw*2 + 36, y, bw, bh, "hard", settings.difficulty === "hard");

  const startW = Math.min(360,W*.8);
  const startH = 78;
  const startX = W/2-startW/2;
  const startY = H*.73;

  menuButton(startX,startY,startW,startH,button);

  ctx.restore();
}
