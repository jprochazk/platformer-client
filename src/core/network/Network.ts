
import NetworkWorker from 'worker-loader!core/network/Worker'

interface Message {
    type: string
}

interface ErrorMessage extends Message {
    type: "error",
    error: Error
}

interface StatusMessage extends Message {
    type: "status",
    status: number
}

interface OpenMessage extends Message {
    type: "open"
}

interface CloseMessage extends Message {
    type: "close",
    code: number,
    reason: string,
    wasClean: boolean
}

interface PacketMessage extends Message {
    type: "packet",
    data: ArrayBuffer,
    timestamp: number
}

export enum NetworkStatus {
    CONNECTING = WebSocket.CONNECTING,
    OPEN = WebSocket.OPEN,
    CLOSING = WebSocket.CLOSING,
    CLOSED = WebSocket.CLOSED,
}

export class NetworkHandle {
    private status_: NetworkStatus;

    constructor(
        private worker: NetworkWorker
    ) {
        this.status_ = NetworkStatus.OPEN;
        worker.onmessage = (e) => {
            const message = e.data as Message;
            switch (message.type) {
                case "error": throw (<ErrorMessage>message).error;
                case "status": return this.status_ = (<StatusMessage>message).status, void (0);
                case "packet": return this.onPacketInternal((<PacketMessage>message).data, (<PacketMessage>message).timestamp);
                case "open": {
                    return console.log("Connection open");
                }
                case "close": {
                    this.status_ = NetworkStatus.CLOSED;
                    this.worker.terminate();
                    return console.log("Connection closed");
                }
                default: throw new Error(`Unknown message type: ${message.type}`);
            }
        }
        worker.onerror = (e) => {
            throw e.error;
        }
    }

    public get status(): NetworkStatus {
        return this.status_;
    }

    private onPacket_: (data: ArrayBuffer, timestamp: number) => void = function () { };
    public set onPacket(callback: (data: ArrayBuffer, timestamp: number) => void) {
        this.onPacket_ = callback;
    }
    private onPacketInternal(data: ArrayBuffer, timestamp: number) {
        this.onPacket_(data, timestamp);
    }

    public sendPacket(packet: Uint8Array) {
        if (this.status_ !== NetworkStatus.OPEN)
            throw new Error(`Connection is not open`);

        this.worker.postMessage({
            type: "packet",
            data: packet
        });
    }

    public close() {
        if (this.status_ === NetworkStatus.CLOSING
            || this.status_ === NetworkStatus.CLOSED)
            return;

        this.worker.postMessage({
            type: "close"
        });
    }
}

export async function StartNetwork(
    url: string,
    options?: {
        timeout?: number,
        retries?: number,
        retryDelay?: number,
        autoReconnect?: boolean,
    }
): Promise<NetworkHandle> {
    return new Promise((resolve, reject) => {
        const worker = new NetworkWorker();
        worker.onmessage = (e) => {
            console.log(e);
            const message = e.data;
            switch (message.type) {
                // we don't handle these here
                case "status": case "packet": case "close": break;
                case "open": { resolve(new NetworkHandle(worker)); break; }
                case "error": { worker.terminate(); reject(message.error); break; }
                default: throw new Error(`Unknown message type: ${message.type}`);
            }
        }
        worker.onerror = (e) => {
            return fail(e);
        }
        worker.postMessage({
            type: "open",
            connection: {
                url, options
            }
        });
    });
}