function floatText(x,y,text,color="white") {
  floats.push({
    x, y, text, color,
    life: 75,
    maxLife: 75,
    vx: (Math.random() - .5) * 5,
    vy: -visualRand(8, 13),
    gravity: .42
  });
}

function burst(x,y,color="white",count=14,power=5) {
  if (!particles) return;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const speed = Math.random() * power + 1;
    particles.push({
      x,y,color,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      r: Math.random() * 4 + 2,
      life: visualRand(22,42),
      maxLife: 42,
      gravity: .12
    });
  }
}

function drawParticles() {
  if (!particles || particles.length <= 0) return;

  ctx.save();
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();

    if (p.life <= 0) particles.splice(i,1);
  }
  ctx.restore();
}
