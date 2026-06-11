const icons = {};

function makeIcon(type) {
  const c = document.createElement("canvas");
  c.width = c.height = 100;
  const g = c.getContext("2d");
  g.save();
  g.lineCap = "round";
  g.lineJoin = "round";
  g.lineWidth = 5;
  g.strokeStyle = "white";

  if (type === "sword" || type === "poison" || type === "vampirePotion") {
    g.fillStyle = type === "poison" ? "#72ff62" : type === "vampirePotion" ? "#7b003f" : "#d8e8ff";
    g.beginPath();
    g.moveTo(52,8); g.lineTo(68,18); g.lineTo(47,67); g.lineTo(35,61);
    g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#8a5a28"; g.fillRect(27,63,42,9);
    g.strokeStyle = type === "poison" ? "#31cc33" : type === "vampirePotion" ? "#ff4f9a" : "#ffd45a";
    g.lineWidth = 8;
    g.beginPath(); g.moveTo(35,78); g.lineTo(22,91); g.stroke();
    g.fillStyle = type === "poison" ? "#31cc33" : type === "vampirePotion" ? "#ff4f9a" : "#ffd45a";
    g.beginPath(); g.arc(20,92,7,0,Math.PI*2); g.fill();
  }

  if (type === "shield") {
    g.fillStyle = "#6aa8ff";
    g.beginPath();
    g.moveTo(50,8); g.lineTo(82,23); g.lineTo(75,68);
    g.lineTo(50,92); g.lineTo(25,68); g.lineTo(18,23);
    g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = "#d8ecff"; g.lineWidth = 6;
    g.beginPath(); g.moveTo(50,18); g.lineTo(50,78); g.stroke();
  }

  if (type === "potion" || type === "regenPotion") {
    g.fillStyle = type === "regenPotion" ? "#40ff96" : "#ff4f6d";
    g.fillRect(39,8,22,22); g.strokeRect(39,8,22,22);
    g.beginPath(); g.arc(50,60,30,0,Math.PI*2); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,.45)";
    g.beginPath(); g.arc(39,49,8,0,Math.PI*2); g.fill();
    if (type === "regenPotion") {
      g.fillStyle = "#063";
      g.font = "bold 22px system-ui";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("RE",50,62);
    }
  }

  if (type === "powerPotion") {
    g.fillStyle = "#ffd84a";
    g.fillRect(39,8,22,22); g.strokeRect(39,8,22,22);
    g.beginPath(); g.arc(50,60,30,0,Math.PI*2); g.fill(); g.stroke();
    g.fillStyle = "#111";
    g.font = "bold 34px system-ui";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("↑",50,62);
  }

  if (type === "killRandomItem" || type === "healRandomItem" || type === "flashBang") {
    g.fillStyle =
      type === "killRandomItem" ? "#151515" :
      type === "healRandomItem" ? "#70ff8a" :
      "#ffffff";
    g.beginPath(); g.roundRect(18,18,64,64,10); g.fill(); g.stroke();
    g.fillStyle = type === "flashBang" || type === "healRandomItem" ? "#111" : "#ff4f4f";
    g.font = "bold 34px system-ui";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(type === "killRandomItem" ? "X" : type === "healRandomItem" ? "+" : "!",50,52);
  }

  if (type === "stoneScroll" || type === "hauntedScroll") {
    g.fillStyle = "#d8d1b0";
    g.beginPath(); g.roundRect(20,20,60,60,8); g.fill(); g.stroke();
    g.fillStyle = type === "hauntedScroll" ? "#6c38d8" : "#777";
    g.font = "bold 35px system-ui";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(type === "hauntedScroll" ? "☾" : "▣",50,52);
  }

  if ([
    "bomb","clearBomb","randomBomb","weakenBomb","strengthBomb",
    "cloudBomb","poisonBomb","healBomb","lightningBomb","iceBomb","zombieBomb"
  ].includes(type)) {
    const colors = {
      bomb:"#222",
      clearBomb:"#ffffff",
      randomBomb:"#c86bff",
      weakenBomb:"#555",
      strengthBomb:"#ff9d3b",
      cloudBomb:"#cfd6e6",
      poisonBomb:"#2ee85f",
      healBomb:"#ff5f8f",
      lightningBomb:"#ffe65c",
      iceBomb:"#72dfff",
      zombieBomb:"#7aff7a"
    };
    g.fillStyle = colors[type];
    g.beginPath(); g.arc(48,58,31,0,Math.PI*2); g.fill(); g.stroke();

    g.strokeStyle = "#aaa"; g.lineWidth = 6;
    g.beginPath(); g.moveTo(65,34); g.quadraticCurveTo(74,18,90,18); g.stroke();

    g.fillStyle = "#ffdd44";
    g.beginPath(); g.arc(91,18,8,0,Math.PI*2); g.fill();

    g.fillStyle = type === "healBomb" || type === "clearBomb" || type === "lightningBomb" || type === "cloudBomb" ? "#111" : "white";
    g.font = "bold 32px system-ui";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(
      type === "poisonBomb" ? "☠" :
      type === "healBomb" ? "+" :
      type === "lightningBomb" ? "⚡" :
      type === "iceBomb" ? "❄" :
      type === "zombieBomb" ? "Z" :
      type === "clearBomb" ? "C" :
      type === "randomBomb" ? "?" :
      type === "weakenBomb" ? "↓" :
      type === "strengthBomb" ? "↑" :
      type === "cloudBomb" ? "☁" : "!",
      48, 60
    );
  }

  if (type === "chest") {
    g.fillStyle = "#9b5a25";
    g.fillRect(18,40,64,42); g.strokeRect(18,40,64,42);
    g.fillStyle = "#c98235";
    g.beginPath(); g.roundRect(18,24,64,34,10); g.fill(); g.stroke();
    g.fillStyle = "#ffd45a"; g.fillRect(44,50,12,15);
  }

  g.restore();
  return c;
}

[
  "sword","shield","potion","poison","bomb","clearBomb","randomBomb",
  "weakenBomb","strengthBomb","cloudBomb","poisonBomb","healBomb","lightningBomb",
  "iceBomb","zombieBomb","chest","powerPotion","regenPotion","vampirePotion","stoneScroll",
  "hauntedScroll","killRandomItem","healRandomItem","flashBang"
].forEach(t => icons[t] = makeIcon(t));
