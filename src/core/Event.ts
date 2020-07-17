
import { ECS } from 'core/ECS'

type EventQueueCallback = (event: CustomEvent) => void;
export class EventQueue implements ECS.System {
    private queue: Array<CustomEvent> = [];
    private listeners: Map<string, Array<EventQueueCallback>> = new Map();

    public update() {
        for (const event of this.queue) {
            const listenerArray = this.listeners.get(event.type);
            if (!listenerArray) continue;
            for (const listener of listenerArray) {
                listener(event);
            }
        }
        this.queue = [];
    }

    public dispatch(type: string, data: any) {
        this.queue.push(new CustomEvent(type, { detail: data }));
    }

    public listen(type: string, callback: EventQueueCallback) {
        let listenerArray = this.listeners.get(type);
        if (!listenerArray) {
            this.listeners.set(type, []);
            listenerArray = this.listeners.get(type)!;
        }

        listenerArray.push(callback);
    }
}