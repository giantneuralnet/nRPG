function clearCloudAt(x,y) {
  if (!clouds || clouds.length <= 0) return false;

  for (let i = clouds.length - 1; i >= 0; i--) {
    const c = clouds[i];
    if (dist(x,y,c.x,c.y) < c.r * 1.15) {
      clouds.splice(i,1);
      floatText(x,y,"CLOUD CLEARED","#ffffff");
      sound("item");
      return true;
    }
  }

  return false;
}

canvas.addEventListener("pointerdown", e => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();

  const x = e.clientX;
  const y = e.clientY;

  if (gameState === "menu") {
    for (const b of menuButtons) {
      if (x > b.x && x < b.x+b.w && y > b.y && y < b.y+b.h) {
        if (b.text === "-") settings.choices = Math.max(1, settings.choices - 1);
        else if (b.text === "+") settings.choices = Math.min(9, settings.choices + 1);
        else if (b.text === "easy" || b.text === "normal" || b.text === "hard") settings.difficulty = b.text;
        else if (b.text === "START") resetGame();
        return;
      }
    }
    return;
  }

  if (gameState === "dead" || gameState === "win") {
    for (const b of menuButtons) {
      if (x > b.x && x < b.x+b.w && y > b.y && y < b.y+b.h) {
        if (b.text === "RESET" || b.text === "PLAY AGAIN") {
          gameState = "menu";
          return;
        }
      }
    }
    return;
  }

  if (gameState !== "playing") return;

  clearCloudAt(x,y);

  for (let i=board.length-1;i>=0;i--) {
    const t = board[i];
    const dx = x-t.x;
    const dy = y-t.y;
    const hitR = t.r*1.55;

    if (dx*dx+dy*dy < hitR*hitR) {
      if (t.type === "item") useItem(t,i);
      else attackMonster(t,i);
      break;
    }
  }
});
