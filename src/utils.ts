interface Click {
  x: number,
  y: number,
}

let ws: WebSocket;

const connectToServer = (setIou: Function) => {
  ws = new WebSocket(process.env.REACT_APP_WS_URL);

  ws.onopen = () => {
    // console.info('WebSocket Connected');
  };

  ws.onclose = () => {
    // console.warn('WebSocket Disconnected');
    setTimeout(() => connectToServer(setIou), 1000);
  };

  ws.onmessage = (e) => {
    const res = JSON.parse(e.data);
    if (res.error) {
      // console.error(res.reason);
      return;
    }

    setIou(res.data);
  };

  return ws;
};

// Sends the rectangle positions to the server
const calculateIoU = (clicks: Click[]) => {
  ws.send(JSON.stringify(clicks));
};

// Draws the rectangle on the canvas
const drawRectangles = (context: CanvasRenderingContext2D, clicks: Click[]) => {
  if (!clicks?.length) { return; }

  context.lineWidth = 1;

  [[clicks[0], clicks[1]], [clicks[2], clicks[3]]].forEach((points, i) => {
    if (!points[0] || !points[1]) { return; }

    context.beginPath();
    context.rect(
      points[0]?.x,
      points[0]?.y,
      points[1].x - points[0].x,
      points[1].y - points[0].y,
    );
    context.fillStyle = i === 0 ? 'rgba(256,0,0,0.5)' : 'rgba(0,0,256,0.5)';
    context.fill();
    context.strokeStyle = i === 0 ? '#ff0000' : '#0000ff';
    context.stroke();
  });
};

// Draws a point
const drawPoint = (context: CanvasRenderingContext2D, click: Click, color: string) => {
  if (!click) { return; }

  context.strokeStyle = color;
  context.lineJoin = 'round';
  context.lineWidth = 5;
  context.beginPath();
  context.arc(click?.x, click?.y, 3, 0, 2 * Math.PI, false);
  context.fillStyle = '#ffffff';
  context.fill();
  context.lineWidth = 5;
  context.stroke();
};

export {
  calculateIoU, connectToServer, drawRectangles, drawPoint,
};
