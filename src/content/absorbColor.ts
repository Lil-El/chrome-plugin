const canvasSize = { width: 240, height: 150 };

main();

async function main() {
  const { imageBitmap, canvas: pageCanvas } = await screenshotPage();

  const glsCanvas = createGlass(canvasSize.width, canvasSize.height);
  const glsCtx = glsCanvas.getContext("2d");

  const abortCtrl = new AbortController();

  pageCanvas.addEventListener(
    "click",
    (e) => {
      abortCtrl.abort();

      const { x, y } = e;
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

      renderCanvas(pageCanvas, glsCtx, x, y);
    },
    {
      signal: abortCtrl.signal,
    }
  );
}

async function renderCanvas(imageBitmap, context, x, y) {
  context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  context.drawImage(
    imageBitmap,
    x - canvasSize.width / 20,
    y - canvasSize.width / 20,
    canvasSize.width / 10,
    canvasSize.height / 10,
    0,
    0,
    canvasSize.width,
    canvasSize.height
  );
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
