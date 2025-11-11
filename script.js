// Opening confetti burst + gentle loop
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
let confettiActive = true;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createConfettiBurst(count = 140) {
  const colors = ['#ff9ac6', '#ffc6a3', '#c9a7ff', '#9ad8ff', '#ffffff'];
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.1) * (6 + Math.random() * 3),
      vy: (Math.random() - 0.6) * (5 + Math.random() * 5),
      g: 0.12 + Math.random() * 0.08,
      size: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
      life: 120 + Math.random() * 100
    });
  }
}
function gentleConfetti(count = 18) {
  const colors = ['#ff9ac6', '#ffc6a3', '#c9a7ff', '#9ad8ff', '#ffffff'];
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 1 + Math.random() * 1.2,
      g: 0.02,
      size: 2 + Math.random() * 3.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.06,
      life: 300 + Math.random() * 120
    });
  }
}
function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = confettiPieces.length - 1; i >= 0; i--) {
    const p = confettiPieces[i];
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 1;

    // wrap from bottom
    if (p.y > canvas.height + 20) p.y = -20;
    if (p.life <= 0) confettiPieces.splice(i, 1);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  }
  if (confettiActive) requestAnimationFrame(drawConfetti);
}
// Initial burst and gentle loop
createConfettiBurst(160);
drawConfetti();
setInterval(() => gentleConfetti(12), 1600);

// Hero fade already handled by CSS; add delayed final message
const finalText = document.querySelector('.final-text');
setTimeout(() => finalText.classList.add('show'), 5000);

// Slideshow
const slides = Array.from(document.querySelectorAll('.slide'));
let current = 0;
function showSlide(idx) {
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
}
function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}
showSlide(current);
let slideTimer = setInterval(nextSlide, 3500);

// Audio controls
const bgSong = document.getElementById('bgSong');
const playSongBtn = document.getElementById('playSongBtn');

let songPlaying = false;
playSongBtn.addEventListener('click', () => {
  if (!songPlaying) {
    bgSong.play().catch(() => {}); // handle mobile autoplay restrictions silently
    playSongBtn.textContent = '⏸ Pause Birthday Song';
    playSongBtn.setAttribute('aria-pressed', 'true');
    songPlaying = true;
  } else {
    bgSong.pause();
    playSongBtn.textContent = '🎵 Play Birthday Song';
    playSongBtn.setAttribute('aria-pressed', 'false');
    songPlaying = false;
  }
});

// Popup controls
const popup = document.getElementById('messagePopup');
const openMessageBtn = document.getElementById('openMessageBtn');
const closePopupBtn = document.getElementById('closePopupBtn');

openMessageBtn.addEventListener('click', () => {
  popup.classList.add('show');
  popup.setAttribute('aria-hidden', 'false');
  // soft confetti accent when opening the message
  createConfettiBurst(60);
});
closePopupBtn.addEventListener('click', () => {
  popup.classList.remove('show');
  popup.setAttribute('aria-hidden', 'true');
});

// Voice message play + progress
const voiceMsg = document.getElementById('voiceMsg');
const playVoiceBtn = document.getElementById('playVoiceBtn');
const voiceBar = document.getElementById('voiceBar');

let voicePlaying = false;
playVoiceBtn.addEventListener('click', () => {
  if (!voicePlaying) {
    voiceMsg.currentTime = 0;
    voiceMsg.play().catch(() => {});
    playVoiceBtn.textContent = '⏸ Pause Voice';
    playVoiceBtn.setAttribute('aria-pressed', 'true');
    voicePlaying = true;
  } else {
    voiceMsg.pause();
    playVoiceBtn.textContent = '▶ Play Voice';
    playVoiceBtn.setAttribute('aria-pressed', 'false');
    voicePlaying = false;
  }
});
voiceMsg.addEventListener('timeupdate', () => {
  const pct = (voiceMsg.currentTime / (voiceMsg.duration || 1)) * 100;
  voiceBar.style.width = `${pct}%`;
});
voiceMsg.addEventListener('ended', () => {
  playVoiceBtn.textContent = '▶ Play Voice';
  playVoiceBtn.setAttribute('aria-pressed', 'false');
  voicePlaying = false;
});

// Improve mobile audio UX: unlock audio on first touch
document.addEventListener('touchstart', () => {
  bgSong.load(); voiceMsg.load();
}, { once: true });

// Accessibility: close popup with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && popup.classList.contains('show')) {
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
  }
});