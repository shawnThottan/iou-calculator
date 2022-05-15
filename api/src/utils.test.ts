import { calculateIoU } from "./utils";
import { randNumber } from '@ngneat/falso';

const noOfDec = parseInt(process.env.NO_DECIMALS);

test('return error if clicks is not an array', async () => {
    const response = calculateIoU(undefined);
    expect(response.error).toBeTruthy();
});

test('return error if clicks array length is not 4', async () => {
    const points = [
        {
            x: randNumber({ min: 0, max: 10 }),
            y: randNumber({ min: 0, max: 10 }),
        },
        {
            x: randNumber({ min: 0, max: 10 }),
            y: randNumber({ min: 0, max: 10 }),
        },
    ];
    const response = calculateIoU(points);
    expect(response.error).toBeTruthy();
});

test('return 0 if rectangles don\'t overlap', async () => {
    const points = [
        {
            x: randNumber({ min: 0, max: 10 }),
            y: randNumber({ min: 0, max: 10 }),
        },
        {
            x: randNumber({ min: 0, max: 10 }),
            y: randNumber({ min: 0, max: 10 }),
        },
        {
            x: randNumber({ min: 20, max: 30 }),
            y: randNumber({ min: 20, max: 30 }),
        },
        {
            x: randNumber({ min: 20, max: 30 }),
            y: randNumber({ min: 20, max: 30 }),
        },
    ];

    const response = calculateIoU(points);
    expect(response.error).not.toBeTruthy();
    expect(response.data).toBe((0).toFixed(noOfDec));
});

test('return 100 if rectangles overlap completely', async () => {
    const x1 = randNumber();
    const y1 = randNumber();
    const x2 = randNumber();
    const y2 = randNumber();
    const points = [
        {
            x: x1,
            y: y1,
        },
        {
            x: x2,
            y: y2,
        },
        {
            x: x1,
            y: y1,
        },
        {
            x: x2,
            y: y2,
        },
    ];

    const response = calculateIoU(points);
    expect(response.error).not.toBeTruthy();
    expect(response.data).toBe((100).toFixed(noOfDec));
});

test('return IoU value if rectangles overlap', async () => {
    const points = [
        {
            x: randNumber({ min: 0, max: 10 }),
            y: randNumber({ min: 0, max: 10 }),
        },
        {
            x: randNumber({ min: 20, max: 30 }),
            y: randNumber({ min: 20, max: 30 }),
        },
        {
            x: randNumber({ min: 0, max: 10 }),
            y: randNumber({ min: 0, max: 10 }),
        },
        {
            x: randNumber({ min: 20, max: 30 }),
            y: randNumber({ min: 20, max: 30 }),
        },
    ];

    const response = calculateIoU(points);
    expect(response.error).not.toBeTruthy();
    expect(parseFloat(response.data)).toBeGreaterThan(0);
});
