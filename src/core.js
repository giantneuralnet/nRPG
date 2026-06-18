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

let activeSeed = 0;
let currentSeed = Math.floor(Date.now() / 1000);
let rngState = 1;

function normalizeSeed(value) {
  const seed = Number.parseInt(value, 10);
  return Number.isFinite(seed) ? seed >>> 0 : 0;
}

function refreshCurrentSeed() {
  currentSeed = Math.floor(Date.now() / 1000) >>> 0;
}

function setGameSeed(seed) {
  activeSeed = normalizeSeed(seed);
  rngState = activeSeed || 1;
}

function rng() {
  rngState = (rngState * 1664525 + 1013904223) >>> 0;
  return rngState / 4294967296;
}

function rand(a,b){ return Math.floor(rng()*(b-a+1))+a; }
function pick(a){ return a[rand(0,a.length-1)]; }
function visualRand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function dist(a,b,c,d){ return Math.hypot(a-c,b-d); }

function formatRunTime(ms) {
  ms = Math.max(0, Math.floor(ms || 0));
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;
  return `${minutes}:${String(seconds).padStart(2,"0")}.${String(millis).padStart(3,"0")}`;
}

let settings = {
  choices: 5,
  difficulty: "normal",
  seed: currentSeed
};
