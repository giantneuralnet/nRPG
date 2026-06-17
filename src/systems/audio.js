let audioCtx, masterGain, windNodes, musicTimer, musicStep = 0, nextMusicAt = 0;
let audioMuted = localStorage.getItem("nrpgAudioMuted") === "1";

function ensureAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  if (!masterGain) {
    masterGain = audioCtx.createGain();
    masterGain.gain.value = audioMuted ? 0 : 1;
    masterGain.connect(audioCtx.destination);
  }
  startWind();
  startMusic();
}

function sound(type) {
  ensureAudio();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(masterGain);
  const now = audioCtx.currentTime;

  if (type === "hit") {
    o.type = "square";
    o.frequency.setValueAtTime(170, now);
    o.frequency.exponentialRampToValueAtTime(70, now+.12);
    g.gain.setValueAtTime(.16, now);
    g.gain.exponentialRampToValueAtTime(.001, now+.15);
  }
  if (type === "item") {
    o.type = "sine";
    o.frequency.setValueAtTime(440, now);
    o.frequency.exponentialRampToValueAtTime(880, now+.18);
    g.gain.setValueAtTime(.14, now);
    g.gain.exponentialRampToValueAtTime(.001, now+.25);
  }
  if (type === "boom") {
    o.type = "sawtooth";
    o.frequency.setValueAtTime(90, now);
    o.frequency.exponentialRampToValueAtTime(25, now+.35);
    g.gain.setValueAtTime(.22, now);
    g.gain.exponentialRampToValueAtTime(.001, now+.4);
  }
  if (type === "zap") {
    o.type = "square";
    o.frequency.setValueAtTime(900, now);
    o.frequency.exponentialRampToValueAtTime(180, now+.18);
    g.gain.setValueAtTime(.16, now);
    g.gain.exponentialRampToValueAtTime(.001, now+.22);
  }
  if (type === "dead") {
    o.type = "triangle";
    o.frequency.setValueAtTime(260, now);
    o.frequency.exponentialRampToValueAtTime(40, now+.45);
    g.gain.setValueAtTime(.2, now);
    g.gain.exponentialRampToValueAtTime(.001, now+.55);
  }
  if (type === "level") {
    o.type = "sine";
    o.frequency.setValueAtTime(520, now);
    o.frequency.setValueAtTime(760, now+.1);
    o.frequency.setValueAtTime(1000, now+.2);
    g.gain.setValueAtTime(.16, now);
    g.gain.exponentialRampToValueAtTime(.001, now+.45);
  }
  if (type === "door") {
    o.type = "triangle";
    o.frequency.setValueAtTime(180, now);
    o.frequency.exponentialRampToValueAtTime(520, now+.16);
    o.frequency.exponentialRampToValueAtTime(130, now+.34);
    g.gain.setValueAtTime(.18, now);
    g.gain.exponentialRampToValueAtTime(.001, now+.42);
  }
  if (type === "bookOpen") {
    o.type = "sine";
    o.frequency.setValueAtTime(260, now);
    o.frequency.exponentialRampToValueAtTime(740, now+.28);
    g.gain.setValueAtTime(.11, now);
    g.gain.exponentialRampToValueAtTime(.001, now+.36);
  }
  if (type === "bookClose") {
    o.type = "triangle";
    o.frequency.setValueAtTime(680, now);
    o.frequency.exponentialRampToValueAtTime(220, now+.22);
    g.gain.setValueAtTime(.1, now);
    g.gain.exponentialRampToValueAtTime(.001, now+.3);
  }

  o.start(now);
  o.stop(now+.7);
}

function startWind() {
  if (!audioCtx || windNodes) return;

  const length = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    last = last * .985 + (Math.random() * 2 - 1) * .015;
    data[i] = last;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 420;
  filter.Q.value = .55;

  const lfo = audioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = .055;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 180;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const howl = audioCtx.createOscillator();
  howl.type = "sine";
  howl.frequency.value = 112;
  const howlGain = audioCtx.createGain();
  howlGain.gain.value = .006;
  howl.connect(howlGain);

  const gain = audioCtx.createGain();
  gain.gain.value = .018;

  noise.connect(filter);
  filter.connect(gain);
  howlGain.connect(gain);
  gain.connect(masterGain);

  noise.start();
  lfo.start();
  howl.start();
  windNodes = { noise, filter, lfo, lfoGain, howl, howlGain, gain };
}

function setAudioMuted(muted) {
  audioMuted = muted;
  localStorage.setItem("nrpgAudioMuted", muted ? "1" : "0");
  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(muted ? 0 : 1, audioCtx.currentTime, .03);
    if (!muted) nextMusicAt = audioCtx.currentTime + .05;
  }
  updateAudioToggle();
}

function updateAudioToggle() {
  const button = document.getElementById("audioToggle");
  if (!button) return;
  button.textContent = audioMuted ? "🔇" : "🔊";
  button.classList.toggle("is-muted", audioMuted);
  button.setAttribute("aria-pressed", audioMuted ? "true" : "false");
}

function startMusic() {
  if (!audioCtx || musicTimer) return;
  nextMusicAt = audioCtx.currentTime + .05;
  musicTimer = setInterval(scheduleMusic, 90);
}

function musicProfile() {
  const monsters = board ? board.filter(t => t.type === "monster" && t.team !== "hero").length : 0;
  const helpful = board ? board.filter(t => t.type === "item" && typeof isHelpfulEntity === "function" && isHelpfulEntity(t)).length : 0;
  const items = board ? board.filter(t => t.type === "item").length : 0;
  const room = currentRoom || 1;
  const profiles = {
    1: { root: 110, scale: [0,3,5,7,10], tempo: .34, lead: [0,2,3,1,4,2,1,0] },
    2: { root: 123.47, scale: [0,2,4,7,9], tempo: .37, lead: [0,1,3,4,2,1,0,2] },
    3: { root: 103.83, scale: [0,3,6,7,10], tempo: .39, lead: [2,0,3,1,4,3,1,0] },
    666: { root: 92.5, scale: [0,1,6,7,10], tempo: .29, lead: [0,2,1,3,4,3,1,2] }
  };
  const base = profiles[room] || profiles[1];
  return {
    ...base,
    room,
    monsters,
    helpful,
    items,
    tension: Math.min(1, monsters / Math.max(1, settings.choices)),
    relief: Math.min(1, helpful / Math.max(1, items || 1))
  };
}

function noteFreq(root, semitone) {
  return root * Math.pow(2, semitone / 12);
}

function scheduleMusic() {
  if (!audioCtx || !masterGain || audioMuted) return;
  const lookahead = audioCtx.currentTime + .25;
  while (nextMusicAt < lookahead) {
    const profile = musicProfile();
    playMusicStep(profile, musicStep, nextMusicAt);
    nextMusicAt += profile.tempo;
    musicStep = (musicStep + 1) % 16;
  }
}

function playMusicStep(profile, step, time) {
  if (gameState === "menu") return;
  const root = profile.root;
  const octave = profile.room === 666 ? .5 : 1;
  const bassDegrees = profile.tension > .45 ? [0,0,2,1] : [0,2,3,2];
  const bassDegree = bassDegrees[Math.floor(step / 4) % bassDegrees.length];
  const bassFreq = noteFreq(root * octave, profile.scale[bassDegree]);

  if (step % 4 === 0) playKick(time, profile.tension);
  if (step % 8 === 4) playSnare(time, profile.relief);
  if (step % 2 === 0) playBass(time, bassFreq, profile.tension);

  const leadSparse = profile.items > profile.monsters ? 4 : 8;
  if (step % leadSparse === 2 || (profile.room === 666 && step % 8 === 6)) {
    const degree = profile.lead[Math.floor(step / 2) % profile.lead.length];
    const leadFreq = noteFreq(root * 2, profile.scale[degree] + (profile.relief > .5 ? 12 : 0));
    playLead(time + profile.tempo * .35, leadFreq, profile);
  }
}

function playKick(time, tension) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(72 + tension * 20, time);
  o.frequency.exponentialRampToValueAtTime(38, time + .12);
  g.gain.setValueAtTime(.035, time);
  g.gain.exponentialRampToValueAtTime(.001, time + .16);
  o.connect(g); g.connect(masterGain);
  o.start(time); o.stop(time + .18);
}

function playSnare(time, relief) {
  const length = Math.floor(audioCtx.sampleRate * .08);
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1200;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(.012 + relief * .006, time);
  g.gain.exponentialRampToValueAtTime(.001, time + .08);
  noise.connect(filter); filter.connect(g); g.connect(masterGain);
  noise.start(time); noise.stop(time + .09);
}

function playBass(time, freq, tension) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  o.type = "square";
  filter.type = "lowpass";
  filter.frequency.value = 280 + tension * 120;
  g.gain.setValueAtTime(.018, time);
  g.gain.exponentialRampToValueAtTime(.001, time + .18);
  o.frequency.setValueAtTime(freq, time);
  o.connect(filter); filter.connect(g); g.connect(masterGain);
  o.start(time); o.stop(time + .2);
}

function playLead(time, freq, profile) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  o.type = profile.room === 666 ? "sawtooth" : "triangle";
  filter.type = "lowpass";
  filter.frequency.value = profile.room === 666 ? 900 : 1200;
  g.gain.setValueAtTime(.009, time);
  g.gain.exponentialRampToValueAtTime(.001, time + .28);
  o.frequency.setValueAtTime(freq, time);
  o.connect(filter); filter.connect(g); g.connect(masterGain);
  o.start(time); o.stop(time + .3);
}
