import { Loop, Default } from 'core/util';
import { Input } from 'core/Input';
import { Renderer, Container, Sprite } from "pixi.js";
import { StartNetwork, NetworkHandle, NetworkStatus } from 'core/network/Network';
import { ECS } from 'core/ECS'
import { PositionBuffer } from 'core/game/component';
import { EventQueue } from 'core/Event';
import { CBOR } from '@jprochazk/cbor'
import { Server } from 'core/Packet';

//@ts-ignore
window.CBOR = CBOR;

/*
TODO:
1. move building inputs into input system
2. design more gameplay elements
3. work on graphics
*/

export class Game {
    private time_: number;

    renderer: Renderer;
    registry: ECS.Registry;
    eventQueue: EventQueue;
    conn: NetworkHandle | null;
    input: Input;

    constructor(private canvas: HTMLCanvasElement) {
        this.time_ = Date.now();
        this.renderer = new Renderer({ view: canvas });
        this.registry = new ECS.Registry();
        this.eventQueue = new EventQueue();
        this.conn = null;
        StartNetwork("ws://localhost:8001/").then((conn) => {
            this.conn = conn;
            this.conn.onPacket = (d, t) => {
                const packet = CBOR.decode(d);
                Server.getHandler(packet.o)?.call(this, packet.d, t);
            }
        });
        this.input = new Input(canvas);

        //@ts-ignore
        window.game = this;
    }

    public get time(): number {
        return this.time_;
    }

    run() {
        const getMoveFlags = () => {
            let out = 0 | 0;
            if (this.input.isKeyPressed("w")) out |= 1;
            if (this.input.isKeyPressed("s")) out |= 2;
            if (this.input.isKeyPressed("a")) out |= 4;
            if (this.input.isKeyPressed("d")) out |= 8;
            return out;
        }
        let last_flags: number = getMoveFlags();
        Loop.run(() => {
            this.time_ = Date.now();
            if (!this.conn || this.conn.status !== NetworkStatus.OPEN) {
                return;
            }

            this.eventQueue.update();

            const flags = getMoveFlags();
            if (flags !== last_flags) {
                this.conn.sendPacket(new Uint8Array(CBOR.encode({
                    "o": 0,
                    "d": {
                        "f": getMoveFlags()
                    }
                })!));
            }
            last_flags = flags;
        }, (renderTime: number) => {
            if (!this.conn || this.conn.status !== NetworkStatus.OPEN) {
                return;
            }

            if (this.canvas.clientWidth !== this.canvas.width || this.canvas.clientHeight !== this.canvas.height) {
                this.canvas.width = this.canvas.clientWidth; this.canvas.height = this.canvas.clientHeight;
                this.renderer.resize(this.canvas.width, this.canvas.height);
            }

            // current approach maybe not so pristine
            // i'm constructing the entire scene for every render...
            // which is multiple times a second (~1-4)
            const container = new Container();
            this.registry.view(["position", "sprite"]).each(
                (entity, position: PositionBuffer, sprite: Sprite) => {
                    if (!position || !sprite) return;
                    const pos = position.get(renderTime - 50);
                    if (!pos) return;
                    sprite.position.set(pos.x - (sprite.texture.width / 2), pos.y - (sprite.texture.height / 2));
                    container.addChild(sprite);
                });
            // TODO remove this shithead :)
            const _testobj = new Sprite(Default.texture());
            _testobj.scale.set(4, 1);
            _testobj.position.set(300 - 128, 768 - 32);
            container.addChild(_testobj);
            this.renderer.render(container);
        }, 60)
    }
}