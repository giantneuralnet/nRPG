const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let W, H;

function getViewportSize() {
  const viewport = window.visualViewport;
  return {
    width: Math.round(viewport?.width || window.innerWidth || document.documentElement.clientWidth),
    height: Math.round(viewport?.height || window.innerHeight || document.documentElement.clientHeight)
  };
}

function resize() {
  const viewport = getViewportSize();
  const pixelRatio = window.devicePixelRatio || 1;
  W = viewport.width;
  H = viewport.height;

  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  canvas.width = Math.round(W * pixelRatio);
  canvas.height = Math.round(H * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (W / rect.width),
    y: (event.clientY - rect.top) * (H / rect.height)
  };
}

addEventListener("resize", resize);
if (window.visualViewport) {
  visualViewport.addEventListener("resize", resize);
  visualViewport.addEventListener("scroll", resize);
}
resize();

function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function pick(a){ return a[rand(0,a.length-1)]; }
function dist(a,b,c,d){ return Math.hypot(a-c,b-d); }

let settings = {
  choices: 5,
  difficulty: "normal"
};
