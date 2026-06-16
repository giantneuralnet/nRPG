let gameState = "menu";
let hero, board, rooms, currentRoom, exileQueue, kills, flash, shake, boom, floats, particles, clouds, lavaPools, soulLinks, lastPoisonTick, lastDecayTick, blindUntil;

function difficultyScale() {
  if (settings.difficulty === "easy") return 0;
  if (settings.difficulty === "hard") return 1.75;
  return 1;
}

function resetGame() {
  setGameSeed(settings.seed);

  hero = {
    hp: 100,
    maxHp: 100,
    atk: 9,
    def: 0,
    poison: 0,
    level: 1,
    xp: 0,
    nextXp: 3,
    alive: true,
    powerAtkTurns: 0,
    powerDefTurns: 0,
    powerAtkBonus: 0,
    powerDefBonus: 0,
    regenTicks: 0,
    regenPower: 0,
    vampire: 0,
    blessed: 0,
    rage: false,
    molten: 0,
    dodge: 0,
    crit: 0,
    surprise: 0,
    decay: 0,
    phoenix: 0,
    confused: 0,
    glitched: 0,
    glitchNextAt: 0,
    unlucky: 0,
    gunpowder: 0
  };

  rooms = {};
  currentRoom = 1;
  exileQueue = [];
  floats = [];
  particles = [];
  clouds = [];
  lavaPools = [];
  soulLinks = [];
  kills = 0;
  flash = "Tap monsters and items";
  shake = 0;
  boom = null;
  blindUntil = 0;
  lastPoisonTick = performance.now();
  lastDecayTick = performance.now();

  board = fillRoom();
  rooms[currentRoom] = board;
  gameState = "playing";
}

function fillRoom() {
  const contents = [];
  const previousBoard = board;
  board = contents;
  for (let i = 0; i < settings.choices; i++) contents.push(spawnThing());
  board = previousBoard;
  return contents;
}

function switchRoom(roomNumber) {
  rooms[currentRoom] = board;
  currentRoom = roomNumber;
  board = rooms[currentRoom] || fillRoom();
  rooms[currentRoom] = board;
  clouds = [];
  lavaPools = [];
  soulLinks = [];
  floats = [];
  flash = `Room ${currentRoom}`;
  sound("door");
}
