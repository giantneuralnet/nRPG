function drawBoom() {
  if (!boom) return;

  ctx.save();

  const progress = 1 - boom.t / 20;

  if (boom.kind === "normal") ctx.strokeStyle = "rgba(255,220,80,.85)";
  if (boom.kind === "clear") ctx.strokeStyle = "rgba(255,255,255,.85)";
  if (boom.kind === "clean") ctx.strokeStyle = "rgba(216,236,255,.85)";
  if (boom.kind === "random") ctx.strokeStyle = "rgba(200,100,255,.85)";
  if (boom.kind === "weaken") ctx.strokeStyle = "rgba(180,180,180,.85)";
  if (boom.kind === "strength") ctx.strokeStyle = "rgba(255,160,60,.85)";
  if (boom.kind === "cloud") ctx.strokeStyle = "rgba(220,230,255,.85)";
  if (boom.kind === "lightning") ctx.strokeStyle = "rgba(255,245,100,.9)";
  if (boom.kind === "poison") ctx.strokeStyle = "rgba(120,255,90,.85)";
  if (boom.kind === "fire") ctx.strokeStyle = "rgba(255,120,40,.9)";
  if (boom.kind === "lava") ctx.strokeStyle = "rgba(255,90,20,.95)";
  if (boom.kind === "contagion") ctx.strokeStyle = "rgba(80,255,115,.9)";
  if (boom.kind === "echo") ctx.strokeStyle = "rgba(114,223,255,.9)";
  if (boom.kind === "heal") ctx.strokeStyle = "rgba(255,100,150,.85)";
  if (boom.kind === "ice") ctx.strokeStyle = "rgba(100,220,255,.9)";
  if (boom.kind === "zombie") ctx.strokeStyle = "rgba(120,255,120,.9)";
  if (boom.kind === "stone") ctx.strokeStyle = "rgba(190,190,190,.9)";
  if (boom.kind === "nuke") ctx.strokeStyle = "rgba(255,60,60,.95)";
  if (boom.kind === "enrage") ctx.strokeStyle = "rgba(255,40,40,.9)";
  if (boom.kind === "blind") ctx.strokeStyle = "rgba(255,255,255,.9)";

  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(boom.x,boom.y,boom.r*progress,0,Math.PI*2);
  ctx.stroke();

  if (boom.kind === "lightning") {
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(boom.x, boom.y);
      ctx.lineTo(boom.x + Math.cos(a) * W, boom.y + Math.sin(a) * H);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawShockwaves() {
  if (!shockwaves || !shockwaves.length) return;

  ctx.save();
  ctx.strokeStyle = "rgba(114,223,255,.9)";
  ctx.lineWidth = 7;
  const now = performance.now();
  for (const wave of shockwaves) {
    const progress = Math.max(0, Math.min(1, (now - wave.startAt) / wave.life));
    ctx.beginPath();
    ctx.arc(wave.x,wave.y,wave.r*progress,0,Math.PI*2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawChargeBolts() {
  if (!chargeBolts || !chargeBolts.length) return;

  ctx.save();
  ctx.lineCap = "round";
  for (const bolt of chargeBolts) {
    const alpha = Math.max(0, bolt.life / bolt.maxLife);
    const segments = 7;
    const dx = bolt.x2 - bolt.x1;
    const dy = bolt.y2 - bolt.y1;
    const len = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;
    ctx.strokeStyle = `rgba(255,245,100,${alpha})`;
    ctx.lineWidth = 3 + alpha * 2;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = bolt.x1 + (bolt.x2 - bolt.x1) * t;
      const y = bolt.y1 + (bolt.y2 - bolt.y1) * t;
      const wobble = Math.sin((bolt.seed + i * 13.7) * 4.1) * 14 * alpha;
      const px = x + nx * wobble;
      const py = y + ny * wobble;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.lineWidth = 2 + alpha;
    for (let branch = 0; branch < 3; branch++) {
      const t = (.25 + branch * .22 + Math.sin(bolt.seed + branch) * .06);
      const baseX = bolt.x1 + dx * t + nx * Math.sin((bolt.seed + branch * 8.3) * 2.7) * 10 * alpha;
      const baseY = bolt.y1 + dy * t + ny * Math.cos((bolt.seed + branch * 7.1) * 2.9) * 10 * alpha;
      const side = branch % 2 ? -1 : 1;
      const length = Math.min(54, Math.max(22, len * (.12 + branch * .025))) * alpha;
      const along = .35 + Math.sin(bolt.seed + branch * 3.1) * .18;
      const endX = baseX + nx * side * length + dx / len * length * along;
      const endY = baseY + ny * side * length + dy / len * length * along;
      const kinkX = (baseX + endX) / 2 + nx * side * 8 * alpha;
      const kinkY = (baseY + endY) / 2 + ny * side * 8 * alpha;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(kinkX, kinkY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawBlind() {
  const remaining = blindUntil - performance.now();
  if (remaining <= 0) return;

  ctx.save();
  ctx.fillStyle = `rgba(255,255,255,${Math.min(.96, .25 + remaining / 6500)})`;
  ctx.fillRect(0,0,W,H);
  ctx.restore();
}
