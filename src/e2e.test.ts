import WS from 'jest-websocket-mock';
import puppeteer from 'puppeteer';

jest.useFakeTimers();

// @ts-ignore
global.WebSocket = WS;

let server: WS;
let browser: puppeteer.Browser;
let page: puppeteer.Page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  server = new WS(process.env.REACT_APP_WS_URL);
});

afterAll(() => {
  server.server.stop();
  browser.close();
});

test('Show instructions to draw', async () => {
  await page.goto('http://localhost:8000');
  const text = await page.$eval('#iou', (ele: { textContent: any; }) => ele.textContent);
  expect(text).toContain('Click/Press and drag to Draw Rectangles.');
});
