const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let isAssembled = false;

const fixedCols = 120;
const fixedRows = 60;

function mapCoord(i, max, minVal, maxVal) {
  return minVal + (i / max) * (maxVal - minVal);
}

function isInsideHeart(x, y) {
  return Math.pow(x * x + y * y - 1.2, 3) - x * x * y * y * y <= 0;
}

function generateParticles() {
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  let gridSize = width / fixedCols;
  const maxHeight = gridSize * fixedRows;

  if (maxHeight > height) {
    gridSize = height / fixedRows;
  }

  if (width < 600) {
    const minGridSize = 10;
    if (gridSize < minGridSize) {
      gridSize = minGridSize;
    }
  }

  const centerX = width / 2;
  const centerY = height / 2.1;

  const heartMap = [];
  let colMin = fixedCols,
    colMax = 0;

  for (let row = 0; row < fixedRows; row++) {
    for (let col = 0; col < fixedCols; col++) {
      const x = mapCoord(col, fixedCols, -3.75, 3.75);
      const y = mapCoord(row, fixedRows, 2, -2);
      if (isInsideHeart(x, y)) {
        if (col < colMin) colMin = col;
        if (col > colMax) colMax = col;
        heartMap.push({ row, col });
      }
    }
  }

  const heartWidthInCols = colMax - colMin + 1;

  particles = heartMap.map(({ row, col }) => {
    const targetX =
      centerX - (heartWidthInCols / 2) * gridSize + (col - colMin) * gridSize;
    const targetY = centerY - (fixedRows / 2) * gridSize + row * gridSize;

    const startX = Math.random() * width;
    const startY = Math.random() * height;

    const color = isAssembled ? [199, 27, 27] : [156, 156, 156];

    return {
      x: startX,
      y: startY,
      targetX: isAssembled ? targetX : startX,
      targetY: isAssembled ? targetY : startY,
      originalTargetX: targetX,
      originalTargetY: targetY,
      size: gridSize,
      speed: 0.01 + Math.random() * 0.005,
      color,
      currentColor: [156, 156, 156],
    };
  });
}

generateParticles();

const btn = document.getElementById("toggleBtn");
btn.addEventListener("click", () => {
  btn.classList.toggle("active");
  isAssembled = !isAssembled;
  btn.textContent = isAssembled ? "😍" : "😢";

  particles.forEach((p) => {
    if (isAssembled) {
      p.targetX = p.originalTargetX;
      p.targetY = p.originalTargetY;
      p.color = [199, 27, 27];
    } else {
      p.targetX = Math.random() * canvas.width;
      p.targetY = Math.random() * canvas.height;
      p.color = [156, 156, 156];
    }
  });
});

function interpolateColor(current, target, factor = 0.015) {
  return current.map((c, i) => c + (target[i] - c) * factor);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.x += (p.targetX - p.x) * p.speed;
    p.y += (p.targetY - p.y) * p.speed;

    p.currentColor = interpolateColor(p.currentColor, p.color);
    const [r, g, b] = p.currentColor.map((v) => Math.round(v));

    ctx.fillStyle = `rgb(${r},${g},${b})`;

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
animate();

window.addEventListener("resize", () => {
  generateParticles();
});
