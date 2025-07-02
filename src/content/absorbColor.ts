main();

async function main() {
  const canvasSize = { width: 240, height: 150 };

  const { canvas: pageCanvas } = await screenshotPage();

  const glsCanvas = createGlass(canvasSize.width, canvasSize.height);
  const glsCtx = glsCanvas.getContext("2d");

  const abortCtrl = new AbortController();

  pageCanvas.addEventListener(
    "click",
    (e) => {
      abortCtrl.abort();
      pageCanvas.remove();

      chrome.storage.local.set({
        pickedColor: getCenterColor(pageCanvas, e.clientX, e.clientY),
      });

      glsCanvas.remove();
    },
    {
      once: true,
    }
  );

  pageCanvas.addEventListener(
    "mousemove",
    async (e) => {
      const { x, y } = e;

      glsCanvas.style.left = `${x + 10}px`;
      glsCanvas.style.top = `${y + 10}px`;

      renderCanvas(canvasSize, pageCanvas, glsCtx, x, y);
    },
    {
      signal: abortCtrl.signal,
    }
  );
}

async function renderCanvas(size, target, context, x, y) {
  context.clearRect(0, 0, size.width, size.height);

  context.drawImage(target, x - 52 / 2, y - 32 / 2, 52, 32, 0, 0, 300, 150);

  context.strokeStyle = "green";
  context.lineWidth = 1;
  context.beginPath();

  context.moveTo(150, 0); // 起点（上端中点）
  context.lineTo(150, 150); // 终点（下端中点）
  context.stroke();

  context.beginPath();
  context.moveTo(0, 75); // 起点（左端中点）
  context.lineTo(300, 75); // 终点（右端中点）
  context.stroke();

  context.closePath();
}

async function screenshotPage() {
  const displayMediaOptions = {
    preferCurrentTab: true,
  };
  const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
  const track = stream.getVideoTracks()[0];
  const imageCapture = new ImageCapture(track);
  const imageBitmap = await imageCapture.grabFrame();

  const canvas = createPage(imageBitmap.width, imageBitmap.height);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx?.drawImage(imageBitmap, 0, 0);

  track.stop();

  return { canvas, imageBitmap };
}

function createPage(width, height) {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.style.zIndex = "99999";
  canvas.style.cursor = "crosshair";
  document.body.appendChild(canvas);
  return canvas;
}

function createGlass(width, height) {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.left = "-1000px";
  canvas.style.top = "-1000px";
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.style.border = "1px solid #000";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);
  return canvas;
}

function getCenterColor(canvas, x, y) {
  const ctx = canvas.getContext("2d");

  const pixelData = ctx.getImageData(x, y, 1, 1).data; // [R, G, B, A]

  const [r, g, b, a] = pixelData;
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}
