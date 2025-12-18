// ===== Snow (canvas) =====
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

let snowOn = true;
let w = 0, h = 0;

function resize() {
  w = canvas.width = window.innerWidth * devicePixelRatio;
  h = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resize);
resize();

const flakes = [];
function initSnow(count = 140) {
  flakes.length = 0;
  for (let i = 0; i < count; i++) {
    flakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 2.2 + 0.6) * devicePixelRatio,
      s: (Math.random() * 0.8 + 0.4) * devicePixelRatio,
      a: Math.random() * Math.PI * 2
    });
  }
}
initSnow();

function snowFrame() {
  if (!snowOn) {
    ctx.clearRect(0, 0, w, h);
    requestAnimationFrame(snowFrame);
    return;
  }

  ctx.clearRect(0, 0, w, h);

  for (const f of flakes) {
    f.a += 0.01;
    f.y += f.s;
    f.x += Math.sin(f.a) * 0.45 * devicePixelRatio;

    if (f.y - f.r > h) {
      f.y = -10 * devicePixelRatio;
      f.x = Math.random() * w;
    }

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fill();
  }

  requestAnimationFrame(snowFrame);
}
snowFrame();

// ===== Letter Open + Typewriter =====
const envelope = document.getElementById("envelope");
const typedEl = document.getElementById("typed");
const sparkles = document.getElementById("sparkles");

const message =
`Pookie,

Walmart’s letters were mid, so I decided to make you one the only way I know how :)

We haven’t known each other for very long, but these past few weeks have been a complete blur in the best way. I found that your eyes and beauty is agressivley hypnotic so if you think about it, you're to blame whenever I randomly stare at you. 

As Elvis said, “Only fools rush in.” You call me dumb a lot, but I like to think it’s because I told you about that song.
And if that makes me a fool, I’m happy to be your fool ❤️. Thinking of what to write took the longest. What I feel for you is hard to explain, but it feels easy when I’m with you.

P.S. I know you've been asking for a goat so I included one on the footer.

Love,`;

let typingTimer = null;

function burstSparkles() {
  const rect = envelope.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < 18; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 90;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    s.style.left = originX + "px";
    s.style.top = originY + "px";
    s.style.setProperty("--dx", dx + "px");
    s.style.setProperty("--dy", dy + "px");

    sparkles.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
}

function typewriter(text, speed = 22) {
  clearInterval(typingTimer);
  typedEl.textContent = "";
  let i = 0;
  typingTimer = setInterval(() => {
    typedEl.textContent += text[i] ?? "";
    i++;
    if (i >= text.length) clearInterval(typingTimer);
  }, speed);
}

function openLetter() {
  envelope.classList.add("open");
  envelope.setAttribute("aria-pressed", "true");
  burstSparkles();
  typewriter(message, 18);
}

function closeLetter() {
  envelope.classList.remove("open");
  envelope.setAttribute("aria-pressed", "false");
  clearInterval(typingTimer);
  typedEl.textContent = "";
}

function toggleOpen() {
  envelope.classList.contains("open") ? closeLetter() : openLetter();
}

envelope.addEventListener("click", toggleOpen);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleOpen();
  }
});

// Buttons
document.getElementById("toggleSnow").addEventListener("click", () => {
  snowOn = !snowOn;
});

document.getElementById("replay").addEventListener("click", () => {
  closeLetter();
  // small delay so the animation feels like a "reset"
  setTimeout(openLetter, 180);
});

// Optional: auto-open once after load (comment out if you want manual only)
setTimeout(() => {
  // only auto-open if user hasn't interacted
  openLetter();
}, 700);
