import { Vec2 } from 'core/math'

export interface Position {
    pos: Vec2,
    time: number
}
export class PositionBuffer {
    private buffer: Array<Position> = [];

    /**
     * @param {Position} initial Buffer must have at least 1 element
     * @param {number} size The maximum number of elements in the buffer (default 5)
     */
    constructor(
        initial: Position,
        private size: number = 5
    ) {
        this.buffer.push(initial);
    }

    public update(pos: Position) {
        // don't add updates where T is lower than or equal to latest T
        if (pos.time <= this.buffer[this.buffer.length - 1].time) return;

        // remove anything past size
        // TODO maybe also maintain a larger buffer
        // if we aren't receiving enough updates
        if (this.buffer.length + 1 > this.size) {
            this.buffer.shift();
        }

        this.buffer.push(pos);
    }

    public get(time: number): Vec2 | null {
        const T = Math.max(0, time);

        // find the last update where update.time < T
        let i = 0;
        let A = this.buffer[i]; // buffer has at least 1 element, so this won't be undefined
        let next = this.buffer[++i] ?? null;
        // if there's another update and its time is lower than T
        while (null !== next && next.time < T) {
            // set A to it, and try get another one
            A = next;
            next = this.buffer[++i] ?? null;
        }

        // try get the update after A
        const B = this.buffer[i + 1] ?? null;
        // if we only get A, return it, because we can't interpolate with only 1 element
        if (null === B) {
            return A.pos;
        }

        // find how far along we are between A and B, and return that
        const weight = (T - A.time) / (B.time - A.time);
        return Vec2.lerp(A.pos, B.pos, weight);
    }
}