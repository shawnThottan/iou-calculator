import 'dotenv/config';

const noOfDec = parseInt(process.env.NO_DECIMALS);

interface click {
    x: number,
    y: number,
}

const calculateIoU = (clicks: click[]) => {
    // clicks array validator
    if (!clicks || clicks.length !== 4) {
        return {
            error: true,
            reason: 'Invalid input clicks.',
        };
    }

    // gets the point x, y coordinates
    const { x: xp1, y: yp1 } = clicks[0];
    const { x: xp2, y: yp2 } = clicks[1];
    const { x: xp3, y: yp3 } = clicks[2];
    const { x: xp4, y: yp4 } = clicks[3];

    // returns error if any point coordinate is not a number
    if (
        typeof xp1 !== 'number' ||
        typeof yp1 !== 'number' ||
        typeof xp2 !== 'number' ||
        typeof yp2 !== 'number' ||
        typeof xp3 !== 'number' ||
        typeof yp3 !== 'number' ||
        typeof xp4 !== 'number' ||
        typeof yp4 !== 'number'
    ) {
        return {
            error: true,
            reason: 'Atleast one of the clicks is of invalid type.',
        };
    }

    const x1 = Math.min(xp1, xp2);
    const y1 = Math.min(yp1, yp2);
    const xMax1 = Math.max(xp1, xp2);
    const yMax1 = Math.max(yp1, yp2);
    const x2 = Math.min(xp3, xp4);
    const y2 = Math.min(yp3, yp4);
    const xMax2 = Math.max(xp3, xp4);
    const yMax2 = Math.max(yp3, yp4);

    const w1 = xMax1 - x1;
    const h1 = yMax1 - y1;
    const w2 = xMax2 - x2;
    const h2 = yMax2 - y2;

    const area1 = w1 * h1;
    const area2 = w2 * h2;

    const inter_x1 = Math.max(x1, x2);
    const inter_y1 = Math.max(y1, y2);
    const inter_x2 = Math.min(x1 + w1, x2 + w2);
    const inter_y2 = Math.min(y1 + h1, y2 + h2);

    const inter_w = Math.max(0, inter_x2 - inter_x1);
    const inter_h = Math.max(0, inter_y2 - inter_y1);

    if (inter_w <= 0 || inter_h <= 0) {
        return {
            error: false,
            data: (0).toFixed(noOfDec)
        };
    } else {
        const inter_area = inter_w * inter_h;
        const iou = inter_area / (area1 + area2 - inter_area);
        return {
            error: false,
            data: (iou * 100).toFixed(noOfDec)
        };
    }
};

export { calculateIoU };