function floatText(x,y,text,color="white") {
  floats.push({
    x, y, text, color,
    life: 75,
    maxLife: 75,
    vx: (Math.random() - .5) * 5,
    vy: -rand(8, 13),
    gravity: .42
  });
}
