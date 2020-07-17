
export class Connection {
    private socket: WebSocket;
    private maxRetries: number;
    private retryDelay: number;
    private retryCount = 0;
    private autoReconnect: boolean;

    constructor(
        readonly url: string,
        options?: {
            timeout?: number,
            retries?: number,
            retryDelay?: number,
            autoReconnect?: boolean,
        }
    ) {
        options = options ?? {};
        this.maxRetries = options.retries ?? 3;
        this.retryDelay = options.retryDelay ?? 3000;
        this.autoReconnect = options.autoReconnect ?? false;
        try {
            this.socket = new WebSocket(url);
        } catch (error) {
            this.onErrorInternal(error);
            throw new Error(`Connection failed -> ${error}`);
        }
        this.socket.onopen = this.onOpenInternal.bind(this);
        this.socket.onmessage = this.onMessageInternal.bind(this);
        this.socket.onclose = this.onCloseInternal.bind(this);
    }

    public send(data: Uint8Array) {
        this.socket.send(data);
    }

    public close() {
        this.socket.close();
    }

    public get status(): number {
        return this.socket.readyState;
    }

    public reconnect() {
        if (this.retryCount >= this.maxRetries) {
            return;
        }

        setTimeout(() => {
            this.socket = new WebSocket(this.url);
            this.socket.onopen = this.onOpenInternal.bind(this);
            this.socket.onmessage = this.onMessageInternal.bind(this);
            this.socket.onclose = this.onCloseInternal.bind(this);
            this.retryCount++;
        }, (this.retryCount + 1) * this.retryDelay);
    }

    private onStateChange_: (state: number) => void = function () { };
    public set onStateChange(callback: (state: number) => void) {
        this.onStateChange_ = callback;
    }
    private async onStateChangeInternal(state: number) {
        this.onStateChange_(state);
    }

    private onMessage_: (data: ArrayBuffer, timestamp: number) => void = function () { };
    public set onMessage(callback: (data: ArrayBuffer, timestamp: number) => void) {
        this.onMessage_ = callback;
    }
    private async onMessageInternal(e: MessageEvent) {
        this.onMessage_(await e.data.arrayBuffer() as ArrayBuffer, Date.now());
    }

    private onOpen_: () => void = function () { };
    public set onOpen(callback: () => void) {
        this.onOpen_ = callback;
    }
    private async onOpenInternal() {
        this.onStateChangeInternal(this.socket.readyState);
        this.retryCount = 0;
        this.onOpen_();
    }

    private onClose_: (code: number, reason: string, wasClean: boolean) => void = function () { };
    public set onClose(callback: (code: number, reason: string, wasClean: boolean) => void) {
        this.onClose_ = callback;
    }
    private async onCloseInternal(e: CloseEvent) {
        this.onStateChangeInternal(this.socket.readyState);
        this.onClose_(e.code, e.reason, e.wasClean);
        if (this.autoReconnect)
            this.reconnect();
    }

    private onError_: (e: Error) => void = function () { };
    public set onError(callback: (e: Error) => void) {
        this.onError_ = callback;
    }
    private async onErrorInternal(e: Error) {
        this.onStateChangeInternal(this.socket.readyState);
        this.onError_(e);
    }
}