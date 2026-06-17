let audioCtx, masterGain, windNodes, musicTimer, musicStep = 0, musicPhrase = 0, nextMusicAt = 0;
let musicState = null;
let actionTimes = [];
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
  musicState = generateMusicState(musicProfile());
  musicTimer = setInterval(scheduleMusic, 90);
}

function recordPlayerAction() {
  const now = performance.now();
  actionTimes.push(now);
  actionTimes = actionTimes.filter(t => now - t < 4500);
}

function musicProfile() {
  const monsters = board ? board.filter(t => t.type === "monster" && t.team !== "hero").length : 0;
  const helpful = board ? board.filter(t => t.type === "item" && typeof isHelpfulEntity === "function" && isHelpfulEntity(t)).length : 0;
  const items = board ? board.filter(t => t.type === "item").length : 0;
  const now = performance.now();
  actionTimes = actionTimes.filter(t => now - t < 4500);
  const action = Math.min(1, actionTimes.length / 9);
  const room = currentRoom || 1;
  const profiles = {
    1: { root: 110, scale: [0,3,5,7,10], tempo: .25, lead: [0,2,3,1,4,2,1,0] },
    2: { root: 123.47, scale: [0,2,4,7,9], tempo: .27, lead: [0,1,3,4,2,1,0,2] },
    3: { root: 103.83, scale: [0,3,6,7,10], tempo: .28, lead: [2,0,3,1,4,3,1,0] },
    666: { root: 92.5, scale: [0,1,6,7,10], tempo: .23, lead: [0,2,1,3,4,3,1,2] }
  };
  const base = profiles[room] || profiles[1];
  return {
    ...base,
    room,
    monsters,
    helpful,
    items,
    health: hero ? Math.max(0, hero.hp / Math.max(1, hero.maxHp)) : 1,
    danger: hero ? 1 - Math.max(0, hero.hp / Math.max(1, hero.maxHp)) : 0,
    action,
    tension: Math.min(1, monsters / Math.max(1, settings.choices)),
    relief: Math.min(1, helpful / Math.max(1, items || 1)),
    intensity: Math.min(1, action * .55 + (hero ? 1 - Math.max(0, hero.hp / Math.max(1, hero.maxHp)) : 0) * .35 + Math.min(1, monsters / Math.max(1, settings.choices)) * .45)
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
    if (!musicState) musicState = generateMusicState(profile);
    if (musicStep === 0) {
      musicPhrase++;
      if (musicPhrase % 2 === 0) evolveMusicState(profile);
    }
    playMusicStep(profile, musicStep, nextMusicAt);
    nextMusicAt += profile.tempo;
    musicStep = (musicStep + 1) % 16;
  }
}

function playMusicStep(profile, step, time) {
  if (gameState === "menu") return;
  const root = profile.root;
  const modeScale = profile.scale;
  const chord = musicState.chords[Math.floor(step / 4) % musicState.chords.length];
  const chordTone = modeScale[chord % modeScale.length];
  const bassDegree = musicState.bass[Math.floor(step / 2) % musicState.bass.length];
  const bassFreq = noteFreq(root, modeScale[bassDegree % modeScale.length]);

  if (musicState.drums[step % musicState.drums.length] & 1) playKick(time, profile.tension);
  if (musicState.drums[step % musicState.drums.length] & 2) playSnare(time, profile.relief);
  if (musicState.drums[step % musicState.drums.length] & 4) playHat(time, profile.intensity);
  if (step % 2 === 0) playBass(time, bassFreq, profile.tension);
  if (step % 8 === 0) playChord(time + .015, root * 2, modeScale, chordTone, profile.health);
  if (profile.intensity > .62 && step % 16 === 8) playPad(time, root * 2, chordTone, profile);

  const leadNote = musicState.lead[step % musicState.lead.length];
  if (leadNote !== null) {
    const leadFreq = noteFreq(root * 2, modeScale[leadNote % modeScale.length]);
    playLead(time + profile.tempo * .35, leadFreq, profile);
  }
}

function generateMusicState(profile) {
  return {
    lead: generateLeadPattern(profile),
    bass: generateBassPattern(profile),
    drums: generateDrumPattern(profile),
    chords: generateChordPattern(profile),
    age: 0
  };
}

function evolveMusicState(profile) {
  musicState.age++;
  const slot = musicState.age % 4;
  if (slot === 0) musicState.lead = generateLeadPattern(profile);
  if (slot === 1) musicState.bass = generateBassPattern(profile);
  if (slot === 2) musicState.drums = generateDrumPattern(profile);
  if (slot === 3) musicState.chords = generateChordPattern(profile);
}

function patternPick(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function generateLeadPattern(profile) {
  const density = Math.min(.72, (profile.items > profile.monsters ? .45 : .25) + profile.action * .25 + profile.danger * .2);
  const pattern = [];
  let note = profile.room === 666 ? 1 : 0;
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0 || Math.random() < density) {
      note = Math.max(0, Math.min(4, note + patternPick([-1,0,1,2])));
      pattern.push(note);
    } else {
      pattern.push(null);
    }
  }
  return pattern;
}

function generateBassPattern(profile) {
  const base = profile.intensity > .55 ? [0,0,2,0,3,2,4,2] : profile.tension > .45 ? [0,0,1,0,2,1,0,1] : [0,2,3,2,0,2,1,2];
  return base.map(n => Math.max(0, Math.min(4, n + (Math.random() < .2 ? patternPick([-1,1]) : 0))));
}

function generateDrumPattern(profile) {
  const pattern = new Array(16).fill(0);
  for (let i = 0; i < 16; i += 4) pattern[i] |= 1;
  for (let i = 4; i < 16; i += 8) pattern[i] |= 2;
  if (profile.intensity > .25) for (let i = 2; i < 16; i += 4) pattern[i] |= 4;
  if (profile.intensity > .55) for (let i = 1; i < 16; i += 2) pattern[i] |= 4;
  if (profile.tension > .45 || profile.action > .55) {
    pattern[8] |= 1;
    pattern[12] |= 2;
  }
  if (profile.relief > .45) pattern[14] |= 2;
  return pattern;
}

function generateChordPattern(profile) {
  if (profile.intensity > .62) return profile.room === 666 ? [0,4,2,4] : [0,4,3,4];
  if (profile.relief > profile.tension) return [0,3,4,2];
  return [0,2,1,3];
}

function playKick(time, tension) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(72 + tension * 20, time);
  o.frequency.exponentialRampToValueAtTime(38, time + .12);
  g.gain.setValueAtTime(.055, time);
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
  g.gain.setValueAtTime(.022 + relief * .01, time);
  g.gain.exponentialRampToValueAtTime(.001, time + .08);
  noise.connect(filter); filter.connect(g); g.connect(masterGain);
  noise.start(time); noise.stop(time + .09);
}

function playHat(time, intensity) {
  const length = Math.floor(audioCtx.sampleRate * .035);
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 5200;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(.008 + intensity * .011, time);
  g.gain.exponentialRampToValueAtTime(.001, time + .04);
  noise.connect(filter); filter.connect(g); g.connect(masterGain);
  noise.start(time); noise.stop(time + .045);
}

function playBass(time, freq, tension) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  o.type = "square";
  filter.type = "lowpass";
  filter.frequency.value = 280 + tension * 120;
  g.gain.setValueAtTime(.036, time);
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
  g.gain.setValueAtTime(.017, time);
  g.gain.exponentialRampToValueAtTime(.001, time + .28);
  o.frequency.setValueAtTime(freq, time);
  o.connect(filter); filter.connect(g); g.connect(masterGain);
  o.start(time); o.stop(time + .3);
}

function playChord(time, root, scale, degree, health) {
  const third = 4;
  const chord = [degree, degree + third, degree + 7];
  for (const semitone of chord) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    o.type = "triangle";
    o.frequency.setValueAtTime(noteFreq(root, semitone), time);
    filter.type = "lowpass";
    filter.frequency.value = 700;
    g.gain.setValueAtTime(.006, time);
    g.gain.exponentialRampToValueAtTime(.001, time + .45);
    o.connect(filter); filter.connect(g); g.connect(masterGain);
    o.start(time); o.stop(time + .5);
  }
}

function playPad(time, root, degree, profile) {
  const chord = [degree, degree + 4, degree + 7, degree + 12];
  for (const semitone of chord) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    o.type = profile.room === 666 ? "sawtooth" : "triangle";
    o.frequency.setValueAtTime(noteFreq(root, semitone), time);
    filter.type = "lowpass";
    filter.frequency.value = 520 + profile.intensity * 260;
    g.gain.setValueAtTime(.001, time);
    g.gain.linearRampToValueAtTime(.008 + profile.intensity * .005, time + .18);
    g.gain.exponentialRampToValueAtTime(.001, time + 1.4);
    o.connect(filter); filter.connect(g); g.connect(masterGain);
    o.start(time); o.stop(time + 1.5);
  }
}
