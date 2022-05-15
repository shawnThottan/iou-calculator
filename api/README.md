# IoU Server
A websocket server with a single open point that takes in the rectangle points and returns the IoU.

## API Documentation
endpoint: ``ws://127.0.0.1:3000``
* change ``PORT`` in the .env file to change the port.

Message: Takes in an array of 4 ``Click``s
* A Click contains 4 points: 
    * x, y number coordinates of the min point of the first rectangle.
    * x, y number coordinates of the max point of the first rectangle.
    * x, y number coordinates of the min point of the second rectangle.
    * x, y number coordinates of the max point of the second rectangle.

* Eg: <code>[ { x: 3, y: 5, }, { x: 6, y: 8, }, { x: 3, y: 7, }, { x: 2, y: 10, } ]</code>

Response: Stringified JSON containing
* error: boolean. Denotes if there was an error in calculating the IoU.
* reason: string. The reason for the error. Present only if error is returned true.
* data: string. Calculated IoU % value.
* Eg error response: <code>{ error: false, data: '25.000' }</code>
* Eg success response: <code>{ error: true, reason: 'Atleast one of the clicks is of invalid type.' }</code>