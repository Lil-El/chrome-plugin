main();

async function main() {
  const overFn = readyFn();

  document.addEventListener(
    "click",
    (e) => {
      overFn();

      const { x, y } = e;
    },
    {
      once: true,
    }
  );

  const displayMediaOptions = {
    preferCurrentTab: true,
  };
  const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
  const canvas = document.querySelector("#absorb-color-canvas")! as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  const video = document.createElement("video");
  // video.srcObject = stream;
  // video.style.width = "100vw";
  // video.style.height = "100vh";
  // video.play();

  window.addEventListener("mousemove", async (e) => {
    const { x, y } = e;

    const canvas = document.querySelector("#absorb-color-canvas")! as HTMLCanvasElement;
    canvas.style.left = `${x + 10}px`;
    canvas.style.top = `${y + 10}px`;

    screenshotPage(stream, canvas, ctx, video, x - 160, y - 90);
  });
}

function readyFn() {
  const canvas = createCanvas();
  document.documentElement.style.pointerEvents = "none";
  document.documentElement.style.cursor = "crosshair";

  return () => {
    document.documentElement.style.pointerEvents = "";
    document.documentElement.style.cursor = "";
    canvas.remove();
  };
}

async function screenshotPage(stream, canvas, ctx, video, x, y) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const track = stream.getVideoTracks()[0];
  const imageCapture = new ImageCapture(track);
  imageCapture.grabFrame().then((imageBitmap) => {
    console.log(imageBitmap);

    ctx.drawImage(imageBitmap, x, y);
  });
}

function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.id = "absorb-color-canvas";
  canvas.style.position = "fixed";
  canvas.style.left = "-1000px";
  canvas.style.top = "-1000px";
  canvas.style.width = "320px";
  canvas.style.height = "180px";
  canvas.style.border = "1px solid #000";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);
  return canvas;
}
