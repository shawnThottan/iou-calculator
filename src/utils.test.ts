import { randHex, randNumber, randText } from '@ngneat/falso';
import WS from 'jest-websocket-mock';

import 'jest-canvas-mock';

import * as utils from './utils';

// @ts-ignore
global.WebSocket = WS;

let server: WS;

beforeAll(() => {
  server = new WS(process.env.REACT_APP_WS_URL);
});

afterAll(() => {
  server.server.stop();
});

const context = {
  beginPath: jest.fn(() => {}),
  rect: jest.fn(() => {}),
  fill: jest.fn(() => {}),
  stroke: jest.fn(() => {}),
  arc: jest.fn(() => {}),
};

test('Connect to websocket server', async () => {
  const setIoU = jest.fn(() => {});
  const client = utils.connectToServer(setIoU);

  const message = JSON.stringify({
    error: false,
    data: randText(),
  });
  client.send(message);
  await expect(server).toReceiveMessage(message);

  server.send(message);
  expect(setIoU).toBeCalled();

  client.close();
});

test('Call setIoU on no error', async () => {
  const setIoU = jest.fn(() => {});
  const client = utils.connectToServer(setIoU);

  const message = JSON.stringify({
    error: false,
    data: randText(),
  });

  server.send(message);
  expect(setIoU).toBeCalled();

  client.close();
});

test('Not call setIoU on error', async () => {
  const setIoU = jest.fn(() => {});
  const client = utils.connectToServer(setIoU);

  const message = JSON.stringify({
    error: true,
    reason: randText(),
  });

  server.send(message);
  expect(setIoU).not.toBeCalled();

  client.close();
});

test('Sends points to server when the input is valid', async () => {
  utils.connectToServer(() => {});

  const points = [
    {
      x: randNumber(),
      y: randNumber(),
    },
    {
      x: randNumber(),
      y: randNumber(),
    },
    {
      x: randNumber(),
      y: randNumber(),
    },
    {
      x: randNumber(),
      y: randNumber(),
    },
  ];

  utils.calculateIoU(points);
  await expect(server).toReceiveMessage(JSON.stringify(points));
});

test('Not draw rectangle on canvas given undefined', async () => {
  utils.drawRectangles(context as unknown as CanvasRenderingContext2D, undefined);
  expect(context.beginPath).not.toBeCalled();
  expect(context.rect).not.toBeCalled();
  expect(context.fill).not.toBeCalled();
  expect(context.stroke).not.toBeCalled();
});

test('Draw 1 rectangle on canvas given 2 points', async () => {
  const points = [
    {
      x: randNumber(),
      y: randNumber(),
    },
    {
      x: randNumber(),
      y: randNumber(),
    },
  ];

  utils.drawRectangles(context as unknown as CanvasRenderingContext2D, points);
  expect(context.beginPath).toBeCalledTimes(1);
  expect(context.rect).toBeCalledTimes(1);
  expect(context.fill).toBeCalledTimes(1);
  expect(context.stroke).toBeCalledTimes(1);
});

test('Draw 2 rectangles on canvas given 4 points', async () => {
  const points = [
    {
      x: randNumber(),
      y: randNumber(),
    },
    {
      x: randNumber(),
      y: randNumber(),
    },
    {
      x: randNumber(),
      y: randNumber(),
    },
    {
      x: randNumber(),
      y: randNumber(),
    },
  ];

  utils.drawRectangles(context as unknown as CanvasRenderingContext2D, points);
  expect(context.beginPath).toBeCalledTimes(2);
  expect(context.rect).toBeCalledTimes(2);
  expect(context.fill).toBeCalledTimes(2);
  expect(context.stroke).toBeCalledTimes(2);
});

test('Draw point', async () => {
  const point = {
    x: randNumber(),
    y: randNumber(),
  };

  const color = randHex();

  utils.drawPoint(context as unknown as CanvasRenderingContext2D, point, color);
  expect(context.beginPath).toBeCalled();
  expect(context.arc).toBeCalled();
  expect(context.fill).toBeCalled();
  expect(context.stroke).toBeCalled();
});

test('Not draw a point if click not provided', async () => {
  const color = randHex();

  utils.drawPoint(context as unknown as CanvasRenderingContext2D, undefined, color);
  expect(context.beginPath).not.toBeCalled();
  expect(context.arc).not.toBeCalled();
  expect(context.fill).not.toBeCalled();
  expect(context.stroke).not.toBeCalled();
});
