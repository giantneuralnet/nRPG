function draw() {
  ctx.clearRect(0,0,W,H);
  if (shake > 0) shake *= .75;

  updateMenuOverlay();

  if (gameState !== "menu") {
    update();
    drawHeroUI();

    for (const t of board) {
      if (t.type === "monster") drawMonster(t);
      else drawItem(t);
    }

    drawBoom();
    drawClouds();

    drawFloats();
  }

  requestAnimationFrame(draw);
}
