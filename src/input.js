function clearCloudAt(x,y) {
  if (!clouds || clouds.length <= 0) return false;

  const cloud = clouds[0];
  const now = performance.now();
  if (now - cloud.lastTap >= 220) {
    cloud.lastTap = now;
    cloud.hits--;
    sound("item");
    if (cloud.hits <= 0) {
      clouds = [];
      flash = "Cloud cleared";
    } else {
      flash = `Cloud ${cloud.hits}/${cloud.maxHits || cloud.hits}`;
    }
  }

  return true;
}

canvas.addEventListener("pointerdown", e => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();

  const { x, y } = canvasPoint(e);

  if (gameState !== "playing") return;

  clearCloudAt(x,y);

  for (let i=board.length-1;i>=0;i--) {
    const t = board[i];
    const dx = x-t.x;
    const dy = y-t.y;
    const hitR = t.r*1.55;

    if (dx*dx+dy*dy < hitR*hitR) {
      if (t.type === "item") useItem(t,i);
      else if (t.type === "door") switchRoom(t.room);
      else if (t.type === "monster") attackMonster(t,i);
      break;
    }
  }
});
