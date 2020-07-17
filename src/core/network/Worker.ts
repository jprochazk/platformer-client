import { Connection } from './Connection'


let connection: Connection | null = null;

const ctx: Worker = self as any;

ctx.onmessage = (e: MessageEvent) => {
    const message = e.data;
    switch (message.type) {
        case "open": {
            const { url, options } = message.connection;
            connection = new Connection(url, options);
            connection.onStateChange = (status) => {
                ctx.postMessage({
                    type: "status",
                    status
                });
            }
            connection.onMessage = (data, timestamp) => {
                ctx.postMessage({
                    type: "packet",
                    data, timestamp
                });
            }
            connection.onOpen = () => {
                ctx.postMessage({
                    type: "open"
                });
            }
            connection.onClose = (code, reason, wasClean) => {
                ctx.postMessage({
                    type: "close",
                    code, reason, wasClean
                });
            }
            connection.onError = (error) => {
                ctx.postMessage({
                    type: "error",
                    error
                });
            }
            break;
        }
        case "close": {
            if (null === connection) {
                ctx.postMessage({
                    type: "error",
                    error: new Error('Connection is not open')
                });
                break;
            }

            connection.close();
            break;
        }
        case "packet": {
            if (null === connection) {
                ctx.postMessage({
                    type: "error",
                    error: new Error('Connection is not open')
                });
                break;
            }

            connection.send(message.data);
            break;
        }
    }
}

ctx.onerror = (event) => {
    console.log(event);
    ctx.postMessage({
        type: "error",
        error: event.error
    });
}