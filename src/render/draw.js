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
    drawClouds();

    drawParticles();
    drawFloats();
    drawBlind();
  }

  requestAnimationFrame(draw);
}

function drawRoomBackground() {
  const colors = {
    1: "#080808",
    2: "#171205",
    3: "#130818",
    666: "#2b0503"
  };
  ctx.fillStyle = gameState === "menu" ? "#080808" : colors[currentRoom] || "#080808";
  ctx.fillRect(0,0,W,H);

  if (gameState !== "menu" && currentRoom === 666) {
    ctx.save();
    for (let i = 0; i < 14; i++) {
      const x = (i * 97 + Math.sin(performance.now() / 900 + i) * 24) % W;
      const h = 70 + Math.sin(performance.now() / 500 + i) * 24;
      ctx.fillStyle = i % 2 ? "rgba(255,80,12,.18)" : "rgba(255,190,40,.12)";
      ctx.beginPath();
      ctx.moveTo(x - 34, H);
      ctx.quadraticCurveTo(x, H - h, x + 34, H);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}
