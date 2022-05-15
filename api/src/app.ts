import { calculateIoU } from "./utils";
import ws from 'ws';
import 'dotenv/config';

const port = parseInt(process.env.PORT);

const wss = new ws.Server({ port });

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        const clicks = JSON.parse(data.toString());
        const response = calculateIoU(clicks);
        ws.send(JSON.stringify(response));
    });
});