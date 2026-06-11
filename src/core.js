const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let W, H;
function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  W = innerWidth;
  H = innerHeight;
}
addEventListener("resize", resize);
resize();

function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function pick(a){ return a[rand(0,a.length-1)]; }
function dist(a,b,c,d){ return Math.hypot(a-c,b-d); }

let settings = {
  choices: 5,
  difficulty: "normal"
};

let menuButtons = [];
