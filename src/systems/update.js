function resolveOverlaps() {
  for (let a=0;a<board.length;a++) {
    for (let b=a+1;b<board.length;b++) {
      const A = board[a], B = board[b];

      if (
        A.type === "monster" &&
        B.type === "monster" &&
        (((A.zombie || A.rage) && A.target === B) || ((B.zombie || B.rage) && B.target === A))
      ) {
        continue;
      }

      const minD = A.r + B.r + 46;
      const d = dist(A.x,A.y,B.x,B.y);

      if (d > 0 && d < minD) {
        const push = (minD-d)*.5;
        const nx = (A.x-B.x)/d;
        const ny = (A.y-B.y)/d;
        A.x += nx*push;
        A.y += ny*push;
        B.x -= nx*push;
        B.y -= ny*push;
      }
    }
  }

  for (const t of board) {
    t.x = Math.max(t.r+20, Math.min(W-t.r-20, t.x));
    t.y = Math.max(155, Math.min(H-t.r-80, t.y));
  }
}

function update() {
  const now = performance.now();

  if (boom) {
    boom.t--;
    if (boom.t <= 0) boom = null;
  }

  if (shockwaves) {
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      shockwaves[i].t--;
      if (shockwaves[i].t <= 0) shockwaves.splice(i,1);
    }
  }

  if (lavaPools) {
    for (let i = lavaPools.length - 1; i >= 0; i--) {
      lavaPools[i].r *= .998;
      lavaPools[i].life--;
      if (lavaPools[i].life <= 0 || lavaPools[i].r < 18) lavaPools.splice(i,1);
    }
  }

  if (soulLinks) {
    for (let i = soulLinks.length - 1; i >= 0; i--) {
      const link = soulLinks[i];
      if (!board.includes(link.a) || !board.includes(link.b) || link.a.hp <= 0 || link.b.hp <= 0) {
        soulLinks.splice(i,1);
      }
    }
  }

  for (let i = floats.length - 1; i >= 0; i--) {
    const f = floats[i];

    f.vy += f.gravity;
    f.x += f.vx;
    f.y += f.vy;

    if (f.x < 20) { f.x = 20; f.vx *= -0.75; }
    if (f.x > W - 20) { f.x = W - 20; f.vx *= -0.75; }
    if (f.y < 20) { f.y = 20; f.vy *= -0.75; }
    if (f.y > H - 40) { f.y = H - 40; f.vy *= -0.75; }

    f.life--;
    if (f.life <= 0) floats.splice(i,1);
  }

  if (gameState !== "playing") return;

  if (hero.decay > 0 && now - lastDecayTick >= 1000) {
    lastDecayTick = now;
    hero.hp -= hero.decay;
    hero.poison += hero.decay;
    floatText(120,100,`DECAY -${hero.decay}`,"#8f6bff");
    if (hero.hp <= 0) die();
  }

  if (hero.glitched > 0 && now >= hero.glitchNextAt) {
    swapAllEntityPositions();
    hero.glitchNextAt = now + rand(500,1000);
    flash = "Glitched!";
  }

  if (now - lastPoisonTick >= 1000) {
    lastPoisonTick = now;
    statusTick();
  }

  for (const t of board) {
    if (t.y < t.targetY) {
      t.vy += .35;
      t.y += t.vy;
      if (t.y > t.targetY) {
        t.y = t.targetY;
        t.vy = 0;
      }
      continue;
    }

    if (t.type === "monster") {
      if (t.stone) {
        t.vx *= .75;
        t.vy *= .75;
        continue;
      }

      if (now < t.frozenUntil) {
        t.vx *= .9;
        t.vy *= .9;
        continue;
      }

      t.wander += .025;
      t.vx += Math.sin(t.wander)*.04;
      t.vy += Math.cos(t.wander*1.4)*.04;

      const speed = (t.zombie || t.rage ? 2.2 : 1) + hero.level*.035 + kills*.005;
      t.vx = Math.max(-speed, Math.min(speed, t.vx));
      t.vy = Math.max(-speed, Math.min(speed, t.vy));

      t.x += t.vx;
      t.y += t.vy;

      if (t.x < t.r+20 || t.x > W-t.r-20) t.vx *= -1;
      if (t.y < 160 || t.y > H-t.r-85) t.vy *= -1;
    }

  }

  allyFights();
  zombieFights();
  resolveOverlaps();
  checkStoneLock();
}
