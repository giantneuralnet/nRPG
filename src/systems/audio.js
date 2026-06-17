let audioCtx, windNodes;

function ensureAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  startWind();
}

function sound(type) {
  ensureAudio();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
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
  gain.connect(audioCtx.destination);

  noise.start();
  lfo.start();
  howl.start();
  windNodes = { noise, filter, lfo, lfoGain, howl, howlGain, gain };
}
