function draw() {
  drawRoomBackground();
  if (shake > 0) shake *= .75;

  updateMenuOverlay();

  if (gameState !== "menu") {
    update();
    drawHeroUI();
    drawLavaPools();

    for (const t of board) {
      if (t.type === "monster") drawMonster(t);
      else if (t.type === "knight") drawKnight(t);
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
    3: "#130818"
  };
  ctx.fillStyle = gameState === "menu" ? "#080808" : colors[currentRoom] || "#080808";
  ctx.fillRect(0,0,W,H);
}
