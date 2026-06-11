function draw() {
  ctx.clearRect(0,0,W,H);
  if (shake > 0) shake *= .75;

  if (gameState === "menu") {
    drawMenu("DROP RPG", "Swords, shields, potions, bombs, elites, ice, zombies, clouds, and curses.", "START");
  } else {
    update();
    drawHeroUI();

    for (const t of board) {
      if (t.type === "monster") drawMonster(t);
      else drawItem(t);
    }

    drawBoom();
    drawClouds();

    if (gameState === "dead") drawMenu("YOU DIED", "Bombs can hurt you too.", "RESET");
    if (gameState === "win") drawMenu("YOU WIN!", "You defeated 20 monsters.", "PLAY AGAIN");

    drawFloats();
  }

  requestAnimationFrame(draw);
}
