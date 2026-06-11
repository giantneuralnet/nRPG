function drawBoom() {
  if (!boom) return;

  ctx.save();

  const progress = 1 - boom.t / 20;

  if (boom.kind === "normal") ctx.strokeStyle = "rgba(255,220,80,.85)";
  if (boom.kind === "clear") ctx.strokeStyle = "rgba(255,255,255,.85)";
  if (boom.kind === "random") ctx.strokeStyle = "rgba(200,100,255,.85)";
  if (boom.kind === "weaken") ctx.strokeStyle = "rgba(180,180,180,.85)";
  if (boom.kind === "strength") ctx.strokeStyle = "rgba(255,160,60,.85)";
  if (boom.kind === "cloud") ctx.strokeStyle = "rgba(220,230,255,.85)";
  if (boom.kind === "lightning") ctx.strokeStyle = "rgba(255,245,100,.9)";
  if (boom.kind === "poison") ctx.strokeStyle = "rgba(120,255,90,.85)";
  if (boom.kind === "heal") ctx.strokeStyle = "rgba(255,100,150,.85)";
  if (boom.kind === "ice") ctx.strokeStyle = "rgba(100,220,255,.9)";
  if (boom.kind === "zombie") ctx.strokeStyle = "rgba(120,255,120,.9)";

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
