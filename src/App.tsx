import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import {
  calculateIoU, connectToServer, drawPoint, drawRectangles,
} from './utils';

function App() {
  // References to HTML elements
  const canvasEl = useRef<HTMLCanvasElement>();
  const iouTextEl = useRef<HTMLDivElement>();

  // Canvas resize on window resize
  const onResize = () => {
    canvasEl.current.width = window.innerWidth;
    canvasEl.current.height = window.innerHeight;
  };
  window.onresize = onResize;

  // state variables
  const [context, setContext] = useState(null);
  const [iou, setIou] = useState(null);
  const isMouseDown = useRef(false);
  const clicks = useRef([]);
  const debounceTimeout = useRef(null);

  // Sets canvas context on init
  useEffect(() => {
    setContext(canvasEl.current.getContext('2d'));
    onResize();
  }, [canvasEl]);

  // connects to the websocket server
  useEffect(() => {
    connectToServer(setIou);
  }, []);

  // Resets on drawing the ground truth bbox again.
  const resetCanvas = () => {
    isMouseDown.current = false;
    clicks.current = [];
    setIou(0);
  };

  // Sets the moving point from the event
  const setPoint = (e, i) => {
    const x = e.clientX === undefined ? e.changedTouches[0].clientX : e.clientX;
    const y = e.clientY === undefined ? e.changedTouches[0].clientY : e.clientY;
    clicks.current[i] = { x, y };
  };

  // Clears the canvas, draws the points and rectangles
  const redraw = () => {
    context.clearRect(0, 0, canvasEl.current.width, canvasEl.current.height);

    drawPoint(context, clicks.current[0], '#ff0000');
    drawPoint(context, clicks.current[1], '#ff0000');
    drawRectangles(context, clicks.current);
    drawPoint(context, clicks.current[2], '#0000ff');
    drawPoint(context, clicks.current[3], '#0000ff');
  };

  // sets calculateIoU, with debounce
  const findIou = () => {
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      const currentClicks = clicks.current;
      const calculatedIoU = calculateIoU(currentClicks);
      if (currentClicks !== clicks.current) { return; }

      setIou(calculatedIoU);
    }, 100);
  };

  const mouseDown = (e) => {
    // resets if predicted bbox already drawn
    if (clicks.current[3]) {
      resetCanvas();
    }

    // sets and draws the points
    const i = clicks.current[0] ? 2 : 0;
    setPoint(e, i);
    redraw();

    isMouseDown.current = true;
  };

  const mouseMove = (e) => {
    if (!isMouseDown.current) { return; }

    // sets and draws the points
    const i = clicks.current[2] ? 3 : 1;
    setPoint(e, i);
    redraw();

    if (i !== 3) { return; }

    // if all points are set, finds IoU
    findIou();
  };

  const mouseUp = (e) => {
    if (!isMouseDown.current) { return; }
    isMouseDown.current = false;

    // sets and draws the points
    const i = clicks.current[2] ? 3 : 1;
    setPoint(e, i);
    redraw();
  };

  return (
    <div className="App">
      <canvas
        width="600"
        height="400"
        ref={canvasEl}
        onMouseDown={mouseDown}
        onTouchStart={mouseDown}
        onMouseMove={mouseMove}
        onTouchMove={mouseMove}
        onMouseUp={mouseUp}
        onTouchEnd={mouseUp}
        onMouseLeave={mouseUp}
      />
      <div id="iou" ref={iouTextEl}>{iou ? `IoU: ${iou}%` : 'Click/Press and drag to Draw Rectangles.'}</div>
    </div>
  );
}

export default App;
