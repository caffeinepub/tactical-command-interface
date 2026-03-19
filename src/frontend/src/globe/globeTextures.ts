import * as THREE from "three";

export function buildDayTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Ocean base
  ctx.fillStyle = "#06101f";
  ctx.fillRect(0, 0, size, size);

  // Latitude band tints
  for (let y = 0; y < size; y += 60) {
    ctx.fillStyle = "rgba(0,120,200,0.04)";
    ctx.fillRect(0, y, size, 30);
  }

  // Continent-like shapes
  const sectors = [
    { x: 110, y: 190, rx: 110, ry: 75 },
    { x: 320, y: 170, rx: 120, ry: 85 },
    { x: 200, y: 350, rx: 90, ry: 65 },
    { x: 400, y: 310, rx: 80, ry: 70 },
    { x: 55, y: 370, rx: 70, ry: 55 },
    { x: 460, y: 200, rx: 60, ry: 80 },
  ];
  for (const c of sectors) {
    const grad = ctx.createRadialGradient(
      c.x,
      c.y,
      0,
      c.x,
      c.y,
      Math.max(c.rx, c.ry),
    );
    grad.addColorStop(0, "rgba(13,48,96,0.85)");
    grad.addColorStop(0.5, "rgba(10,32,64,0.45)");
    grad.addColorStop(1, "rgba(6,16,31,0)");
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Polar caps
  const northGrad = ctx.createRadialGradient(256, 0, 0, 256, 0, 110);
  northGrad.addColorStop(0, "rgba(0,180,255,0.22)");
  northGrad.addColorStop(1, "rgba(0,180,255,0)");
  ctx.fillStyle = northGrad;
  ctx.fillRect(0, 0, size, 110);

  const southGrad = ctx.createRadialGradient(256, 512, 0, 256, 512, 110);
  southGrad.addColorStop(0, "rgba(0,180,255,0.22)");
  southGrad.addColorStop(1, "rgba(0,180,255,0)");
  ctx.fillStyle = southGrad;
  ctx.fillRect(0, 402, size, 110);

  // Cyan energy traces
  const traces: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ][] = [
    [20, 200, 80, 100, 200, 80, 300, 220],
    [100, 350, 220, 280, 340, 200, 460, 350],
    [50, 100, 150, 50, 320, 120, 480, 180],
    [0, 250, 100, 380, 300, 400, 512, 280],
    [80, 420, 200, 480, 380, 430, 500, 350],
    [200, 50, 280, 20, 380, 80, 480, 60],
    [10, 160, 120, 320, 280, 300, 400, 160],
    [300, 400, 380, 480, 460, 430, 512, 400],
  ];
  ctx.strokeStyle = "rgba(0,200,255,0.13)";
  ctx.lineWidth = 1.5;
  for (const [x0, y0, cx1, cy1, cx2, cy2, x1, y1] of traces) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x1, y1);
    ctx.stroke();
  }

  // Emissive hotspot dots
  const lights: [number, number][] = [
    [130, 195],
    [310, 175],
    [205, 345],
    [385, 300],
    [65, 360],
    [250, 248],
    [178, 148],
    [402, 402],
    [98, 118],
    [455, 205],
  ];
  for (const [lx, ly] of lights) {
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 5);
    g.addColorStop(0, "rgba(0,200,255,0.6)");
    g.addColorStop(1, "rgba(0,200,255,0)");
    ctx.beginPath();
    ctx.arc(lx, ly, 5, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

export function buildNightTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Pure black base
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, size, size);

  // City light clusters near continent zones
  const clusters = [
    { x: 110, y: 190, count: 22 },
    { x: 320, y: 170, count: 28 },
    { x: 200, y: 350, count: 18 },
    { x: 400, y: 310, count: 20 },
    { x: 55, y: 370, count: 12 },
    { x: 460, y: 200, count: 16 },
    { x: 250, y: 248, count: 10 },
    { x: 178, y: 148, count: 8 },
  ];

  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  };

  for (const cl of clusters) {
    const rand = rng(cl.x * 31 + cl.y);
    for (let i = 0; i < cl.count; i++) {
      const ox = (rand() - 0.5) * 80;
      const oy = (rand() - 0.5) * 60;
      const px = cl.x + ox;
      const py = cl.y + oy;
      const isAmber = rand() > 0.35;
      const r = 1.5 + rand() * 2.5;
      const g = ctx.createRadialGradient(px, py, 0, px, py, r);
      if (isAmber) {
        g.addColorStop(0, "rgba(255,200,80,0.9)");
        g.addColorStop(1, "rgba(255,200,80,0)");
      } else {
        g.addColorStop(0, "rgba(255,255,200,0.7)");
        g.addColorStop(1, "rgba(255,255,200,0)");
      }
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  // Sparse scatter points
  const rand2 = rng(42);
  for (let i = 0; i < 80; i++) {
    const px = rand2() * size;
    const py = rand2() * size;
    const r = 0.8 + rand2() * 1.2;
    const g = ctx.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, "rgba(255,220,120,0.5)");
    g.addColorStop(1, "rgba(255,220,120,0)");
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

export function buildCloudTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Black base for alphaMap
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, size, size);

  const rand = (() => {
    let s = 7919;
    return () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  })();

  // Wispy latitude streaks
  for (let i = 0; i < 8; i++) {
    const y = rand() * size;
    const width = 20 + rand() * 60;
    const grad = ctx.createLinearGradient(0, y - width / 2, 0, y + width / 2);
    const alpha = 0.15 + rand() * 0.35;
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, y - width / 2, size, width);
  }

  // Cumulus blobs
  for (let i = 0; i < 30; i++) {
    const cx = rand() * size;
    const cy = rand() * size;
    const rx = 20 + rand() * 60;
    const ry = 10 + rand() * 30;
    const alpha = 0.1 + rand() * 0.4;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
    g.addColorStop(0, `rgba(255,255,255,${alpha})`);
    g.addColorStop(0.6, `rgba(255,255,255,${alpha * 0.4})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

export function buildHexTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const hexSize = 28;
  const hexWidth = hexSize * 2;
  const hexHeight = Math.sqrt(3) * hexSize;
  const centers: [number, number][] = [];

  ctx.strokeStyle = "rgba(0,210,255,0.22)";
  ctx.lineWidth = 0.6;

  function drawHex(cx: number, cy: number) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      const px = cx + hexSize * Math.cos(angle);
      const py = cy + hexSize * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  for (let row = -1; row < size / hexHeight + 2; row++) {
    for (let col = -1; col < size / hexWidth + 2; col++) {
      const x = col * hexWidth * 0.75;
      const y = row * hexHeight + (col % 2 === 0 ? 0 : hexHeight / 2);
      drawHex(x, y);
      centers.push([x, y]);
    }
  }

  const shuffled = [...centers].sort(() => Math.random() - 0.5);
  const tier1Count = Math.floor(centers.length * 0.05);
  ctx.strokeStyle = "rgba(0,255,255,0.55)";
  ctx.lineWidth = 1.2;
  for (let g = 0; g < tier1Count; g++) {
    const [x, y] = shuffled[g];
    drawHex(x, y);
  }

  const tier2Count = Math.floor(centers.length * 0.02);
  ctx.strokeStyle = "rgba(100,255,255,0.85)";
  ctx.lineWidth = 1.6;
  for (let g = tier1Count; g < tier1Count + tier2Count; g++) {
    const [x, y] = shuffled[g];
    drawHex(x, y);
  }

  ctx.strokeStyle = "rgba(0,180,255,0.06)";
  ctx.lineWidth = 0.4;
  for (const y of [256, 512, 768]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  for (const x of [256, 512, 768]) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}
