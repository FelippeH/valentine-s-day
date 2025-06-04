const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gridSize = 15;
let particles = [];
let isAssembled = false;

function mapCoord(i, max, minVal, maxVal) {
  return minVal + (i / max) * (maxVal - minVal);
}

function isInsideHeart(x, y) {
  return Math.pow(x * x + y * y - 1.2, 3) - x * x * y * y * y <= 0;
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function buildHeart() {
  resizeCanvas();

  particles = [];

  const cols = Math.floor(canvas.width / gridSize);
  const rows = Math.floor(canvas.height / gridSize);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  let colMin = cols,
    colMax = 0;
  const heartMap = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = mapCoord(col, cols, -3.75, 3.75);
      const y = mapCoord(row, rows, 2, -2);

      if (isInsideHeart(x, y)) {
        if (col < colMin) colMin = col;
        if (col > colMax) colMax = col;
        heartMap.push({ row, col });
      }
    }
  }

  const heartWidthInCols = colMax - colMin + 1;

  heartMap.forEach(({ row, col }) => {
    const targetX =
      centerX - (heartWidthInCols / 2) * gridSize + (col - colMin) * gridSize;
    const targetY = centerY - (rows / 2) * gridSize + row * gridSize;

    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height;

    particles.push({
      x: startX,
      y: startY,
      targetX: isAssembled ? targetX : startX,
      targetY: isAssembled ? targetY : startY,
      originalTargetX: targetX,
      originalTargetY: targetY,
      size: gridSize,
      speed: 0.01 + Math.random() * 0.005,
    });
  });
}

//botão
const btn = document.getElementById("toggleBtn");
btn.addEventListener("click", () => {
  isAssembled = !isAssembled;
  btn.textContent = isAssembled ? "😍" : "😢";

  particles.forEach((p) => {
    if (isAssembled) {
      p.targetX = p.originalTargetX;
      p.targetY = p.originalTargetY;
    } else {
      p.targetX = Math.random() * canvas.width;
      p.targetY = Math.random() * canvas.height;
    }
  });
});

//animação
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.x += (p.targetX - p.x) * p.speed;
    p.y += (p.targetY - p.y) * p.speed;

    ctx.fillStyle = "#c71b1b";
    const padding = 1;
    ctx.fillRect(
      p.x + padding / 2,
      p.y + padding / 2,
      p.size - padding,
      p.size - padding
    );
  });

  requestAnimationFrame(animate);
}

window.addEventListener("resize", buildHeart);

buildHeart();
animate();
