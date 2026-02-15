// Original ASCII Glitch Effect by Bastien Cornier (https://bastiencornier.com)

const WAVE_THRESH = 3;
const CHAR_MULT = 3;
const ANIM_STEP = 40;
const WAVE_BUF = 5;

// 'export' 키워드 제거
const createASCIIShift = (el, opts = {}) => {
  let origTxt = el.textContent;
  let origChars = origTxt.split("");
  let isAnim = false;
  let cursorPos = 0;
  let waves = [];
  let animId = null;
  let isHover = false;
  let origW = null;

  const cfg = {
    dur: 600,
    chars: '.,·-─~+:;=*π""┐┌┘┴┬╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐■!?&#$@0123456789*',
    preserveSpaces: true,
    spread: 0.3,
    ...opts
  };

  const updateCursorPos = (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const len = origTxt.length;
    const pos = Math.round((x / rect.width) * len);
    cursorPos = Math.max(0, Math.min(pos, len - 1));
  };

  const startWave = () => {
    waves.push({
      startPos: cursorPos,
      startTime: Date.now(),
      id: Math.random()
    });
    if (!isAnim) start();
  };

  const cleanupWaves = (t) => {
    waves = waves.filter((w) => t - w.startTime < cfg.dur);
  };

  const calcWaveEffect = (charIdx, t) => {
    let shouldAnim = false;
    let resultChar = origChars[charIdx];

    for (const w of waves) {
      const age = t - w.startTime;
      const prog = Math.min(age / cfg.dur, 1);
      const dist = Math.abs(charIdx - w.startPos);
      const maxDist = Math.max(w.startPos, origChars.length - w.startPos - 1);
      const rad = (prog * (maxDist + WAVE_BUF)) / cfg.spread;

      if (dist <= rad) {
        shouldAnim = true;
        const intens = Math.max(0, rad - dist);
        if (intens <= WAVE_THRESH && intens > 0) {
          const cIdx = (dist * CHAR_MULT + Math.floor(age / ANIM_STEP)) % cfg.chars.length;
          resultChar = cfg.chars[cIdx];
        }
      }
    }
    return { shouldAnim, char: resultChar };
  };

  const genScrambledTxt = (t) =>
    origChars.map((char, i) => {
      if (cfg.preserveSpaces && char === " ") return " ";
      const res = calcWaveEffect(i, t);
      return res.shouldAnim ? res.char : char;
    }).join("");

  const stop = () => {
    el.textContent = origTxt;
    el.classList.remove("as");
    if (origW !== null) {
      el.style.width = "";
      origW = null;
    }
    isAnim = false;
  };

  const start = () => {
    if (isAnim) return;
    if (origW === null) {
      origW = el.getBoundingClientRect().width;
      el.style.width = `${origW}px`;
    }
    isAnim = true;
    el.classList.add("as");
    const animate = () => {
      const t = Date.now();
      cleanupWaves(t);
      if (waves.length === 0) {
        stop();
        return;
      }
      el.textContent = genScrambledTxt(t);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
  };

  const handleEnter = (e) => { isHover = true; updateCursorPos(e); startWave(); };
  const handleMove = (e) => { if (!isHover) return; const old = cursorPos; updateCursorPos(e); if (cursorPos !== old) startWave(); };
  const handleLeave = () => { isHover = false; };

  const init = () => {
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
  };

  init();
  return { destroy: () => { /* cleanup logic */ } };
};

// 페이지 로드 후 실행되도록 보장
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    if (!link.textContent.trim()) return;
    createASCIIShift(link, { dur: 1000, spread: 1 });
  });
});