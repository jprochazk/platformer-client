
export class Input {
    private keys = new Map<string, boolean>();
    private keyEvents = new Map<string, ((value: boolean, event: KeyboardEvent) => void)[]>();

    constructor(
        private element: HTMLElement
    ) {
        window.addEventListener("keydown", this.onKeydown.bind(this));
        window.addEventListener("keyup", this.onKeyup.bind(this));
    }

    public isKeyPressed(key: string) {
        return this.keys.get(key.toLowerCase()) || false;
    }

    public registerKeyEvent(key: string, callback: (value: boolean, event: KeyboardEvent) => void) {
        const arr = this.keyEvents.get(key);
        if (arr) arr.push(callback);
        else this.keyEvents.set(key, [callback])
    }

    private onKeyChange(key: string, value: boolean, event: KeyboardEvent) {
        const callbacks = this.keyEvents.get(key);
        if (!callbacks) return;
        for (const callback of callbacks) {
            callback(value, event)
        }
    }

    private onKeydown(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        if (this.keys.get(key)) return;

        this.keys.set(key, true);
        this.onKeyChange(key, true, event);
    }

    private onKeyup(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        if (!this.keys.get(key)) return;

        this.keys.set(key, false);
        this.onKeyChange(key, false, event);
    }
}