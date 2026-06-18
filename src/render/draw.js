function draw() {
  drawRoomBackground();
  if (shake > 0) shake *= .75;

  updateMenuOverlay();

  if (gameState !== "menu") {
    update();
    drawHeroUI();
    drawLavaPools();
    drawSoulLinks();

    for (const t of board) {
      if (t.type === "monster") drawMonster(t);
      else if (t.type === "door") drawDoor(t);
      else drawItem(t);
    }

    drawBoom();
    drawShockwaves();
    drawClouds();

    drawParticles();
    drawFloats();
    drawBlind();
  }

  requestAnimationFrame(draw);
}

function drawRoomBackground() {
  if (gameState === "menu") {
    ctx.fillStyle = "#080808";
    ctx.fillRect(0,0,W,H);
    return;
  }

  const bg = getRoomBackground(currentRoom);
  if (bg) ctx.drawImage(bg,0,0,W,H);
  else {
    ctx.fillStyle = "#080808";
    ctx.fillRect(0,0,W,H);
  }

  if (currentRoom === 666) {
    ctx.save();
    const now = performance.now();
    const count = Math.max(12, Math.floor(W / 32));
    for (let i = 0; i < count; i++) {
      const size = 4 + (i % 5);
      const phase = (now * (.035 + (i % 4) * .006) + i * 83) % (H + 90);
      const x = (i * 71 + Math.sin(now / 700 + i) * 18) % W;
      const y = H + 35 - phase;
      const alpha = Math.max(0, Math.min(.45, y / H)) * (i % 3 === 0 ? .9 : .55);
      ctx.fillStyle = i % 2 ? `rgba(255,85,28,${alpha})` : `rgba(255,190,70,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

let roomBackgroundCache = {};

function getRoomBackground(room) {
  const key = `${room}:${W}:${H}:${activeSeed}`;
  if (!roomBackgroundCache[key]) roomBackgroundCache[key] = createRoomBackground(room, W, H);
  return roomBackgroundCache[key];
}

function roomBgRng(room) {
  let state = ((activeSeed || 1) ^ (room * 2654435761) ^ 0x9e3779b9) >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createRoomBackground(room, w, h) {
  const bg = document.createElement("canvas");
  bg.width = Math.max(1, Math.floor(w));
  bg.height = Math.max(1, Math.floor(h));
  const g = bg.getContext("2d");
  const r = roomBgRng(room);

  if (room === 1) drawWoodFloor(g, w, h, r);
  else if (room === 2) drawCarpet(g, w, h, r);
  else if (room === 3) drawGrass(g, w, h, r);
  else if (room === 666) drawLavaRock(g, w, h, r);
  else {
    g.fillStyle = "#080808";
    g.fillRect(0,0,w,h);
  }

  g.fillStyle = "rgba(0,0,0,.34)";
  g.fillRect(0,0,w,h);
  return bg;
}

function drawWoodFloor(g, w, h, r) {
  g.fillStyle = "#120b06";
  g.fillRect(0,0,w,h);
  const plankH = Math.max(54, Math.floor(h / 9));
  for (let y = -plankH; y < h + plankH; y += plankH) {
    const shade = 20 + Math.floor(r() * 18);
    g.fillStyle = `rgb(${shade + 10},${shade + 2},${Math.max(2, shade - 10)})`;
    g.fillRect(0,y,w,plankH - 2);
    g.strokeStyle = "rgba(0,0,0,.55)";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(0,y);
    g.lineTo(w,y);
    g.stroke();
    const seamStep = 170 + Math.floor(r() * 80);
    const seamOffset = Math.floor(r() * seamStep);
    for (let x = -seamOffset; x < w + seamStep; x += seamStep) {
      g.strokeStyle = "rgba(0,0,0,.32)";
      g.beginPath();
      g.moveTo(x,y + 3);
      g.lineTo(x,y + plankH - 5);
      g.stroke();
    }
    for (let i = 0; i < 3; i++) {
      const yy = y + 8 + r() * (plankH - 16);
      g.strokeStyle = "rgba(255,210,140,.045)";
      g.beginPath();
      g.moveTo(0,yy);
      for (let x = 0; x < w; x += 70) g.lineTo(x, yy + Math.sin(x * .02 + r() * 4) * 2);
      g.stroke();
    }
  }
}

function drawCarpet(g, w, h, r) {
  g.fillStyle = "#160909";
  g.fillRect(0,0,w,h);
  const tile = 44;
  for (let y = 0; y < h; y += tile) {
    for (let x = 0; x < w; x += tile) {
      const v = 18 + Math.floor(r() * 18);
      g.fillStyle = `rgb(${v + 18},${Math.floor(v * .45)},${Math.floor(v * .55)})`;
      g.fillRect(x,y,tile,tile);
    }
  }
  g.strokeStyle = "rgba(180,90,80,.1)";
  g.lineWidth = 1;
  for (let x = -h; x < w; x += 72) {
    g.beginPath();
    g.moveTo(x,0);
    g.lineTo(x + h,h);
    g.stroke();
  }
  for (let x = 0; x < w + h; x += 72) {
    g.beginPath();
    g.moveTo(x,0);
    g.lineTo(x - h,h);
    g.stroke();
  }
}

function drawGrass(g, w, h, r) {
  g.fillStyle = "#061206";
  g.fillRect(0,0,w,h);
  for (let i = 0; i < Math.floor(w * h / 2400); i++) {
    const x = r() * w;
    const y = r() * h;
    const len = 4 + r() * 10;
    const green = 28 + Math.floor(r() * 40);
    g.strokeStyle = `rgba(${Math.floor(green * .35)},${green},${Math.floor(green * .25)},.32)`;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x,y);
    g.lineTo(x + (r() - .5) * 8, y - len);
    g.stroke();
  }
  for (let i = 0; i < 14; i++) {
    g.fillStyle = "rgba(0,0,0,.12)";
    g.beginPath();
    g.ellipse(r() * w, r() * h, 30 + r() * 80, 14 + r() * 45, r() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
}

function drawLavaRock(g, w, h, r) {
  g.fillStyle = "#160302";
  g.fillRect(0,0,w,h);
  for (let i = 0; i < Math.floor(w * h / 7600); i++) {
    const x = r() * w;
    const y = r() * h;
    const rad = 24 + r() * 80;
    g.fillStyle = r() < .18 ? "rgba(180,35,12,.24)" : "rgba(45,13,11,.85)";
    g.beginPath();
    g.ellipse(x,y,rad,rad * (.45 + r() * .45),r() * Math.PI,0,Math.PI * 2);
    g.fill();
  }
  for (let i = 0; i < 10; i++) {
    g.strokeStyle = "rgba(255,80,20,.1)";
    g.lineWidth = 2 + r() * 3;
    g.beginPath();
    let x = r() * w;
    let y = r() * h;
    g.moveTo(x,y);
    for (let j = 0; j < 6; j++) {
      x += (r() - .5) * 120;
      y += (r() - .5) * 90;
      g.lineTo(x,y);
    }
    g.stroke();
  }
}
