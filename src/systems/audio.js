let audioCtx;
function sound(type) {
  if (!audioCtx) audioCtx = new AudioContext();
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

  o.start(now);
  o.stop(now+.7);
}
