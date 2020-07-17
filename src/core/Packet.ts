import { Sprite } from 'pixi.js';
import { Game } from 'core/Game';
import { PositionBuffer } from './game/component';
import { Vec2 } from './math';
import { Default, NOOP } from './util';
import { ECS } from 'core/ECS';

interface IdPacket {
    v: number
}
function handleId(context: Game, data: IdPacket, time: number): void {
    console.log(time, data.v);
}

function spriteCreate() {
    return new Sprite(Default.texture());
}
interface PositionComponent {
    x: number,
    y: number
}
function positionCreate(pos: Vec2, time: number) {
    return new PositionBuffer({ pos, time });
}
function positionUpdate(component: PositionBuffer, pos: Vec2, time: number) {
    component.update({ pos, time });
}
interface ComponentStorage {
    p?: PositionComponent
}
interface Entity {
    i: number,
    c?: ComponentStorage
}
interface StatePacket {
    e: Entity[]
}

function handleComponents(
    registry: ECS.Registry,
    entity: ECS.Entity,
    components: ComponentStorage,
    time: number
): void {
    // TODO: sprite as <display> component
    registry.emplace_or_update<Sprite>(
        "sprite", entity,
        spriteCreate, NOOP
    );

    const pos = components.p;
    if (pos) {
        registry.emplace_or_update<PositionBuffer>(
            "position", entity,
            positionCreate, positionUpdate,
            Vec2.create([pos.x, pos.y]),
            time
        );
    } else {
        if (registry.has("position", entity)) {
            registry.remove("position", entity);
        }
    }
}
function handleState(context: Game, data: StatePacket, time: number): void {
    //const registry = context.registry;
    const seen = new Set<ECS.Entity>();
    for (const { i: entity, c: components } of data.e) {
        if (!context.registry.alive(entity)) {
            console.log(`entity ID ${ECS.Registry.id(entity)}, action: create, components: `, components);
            context.registry.insert(entity);
            if (components) {
                handleComponents(context.registry, entity, components, time);
            }
        } else {
            console.log(`entity ID ${ECS.Registry.id(entity)}, action: update, components: `, components);
            if (components) {
                handleComponents(context.registry, entity, components, time);
            }
        }
        seen.add(entity);
    }
    context.registry.view([]).each((entity) => {
        if (!seen.has(entity)) {
            console.log(`entity ID ${ECS.Registry.id(entity)}, action: delete`);
            context.registry.destroy(entity);
        }
    });
}

export namespace Server {

    export enum Opcode {
        ID = 0,
        STATE
    }

    export type FunctionType = (context: Game, data: any, time: number) => void;
    export class Handler {
        constructor(
            readonly opcode: Opcode,
            readonly fn: FunctionType | null
        ) { }

        public call(context: Game, data: any, time: number): void {
            if (!this.fn) return;
            this.fn(context, data, time);
        }
    }

    const HANDLER_TABLE: Handler[] = [];
    HANDLER_TABLE[Opcode.ID] = new Handler(Opcode.ID, handleId);
    HANDLER_TABLE[Opcode.STATE] = new Handler(Opcode.STATE, handleState);
    const DEFAULT_HANDLER = new Handler(-1 as Opcode, null);

    export function getHandler(opcode: Opcode): Handler | null {
        const handler = HANDLER_TABLE[opcode] ?? DEFAULT_HANDLER;
        return handler;
    }

    export function toString(opcode: Opcode): string {
        const str = Opcode[opcode];
        if (!str) return "NULL";
        return str;
    }

}

export namespace Client {

    export enum Opcode {
        INPUT = 0
    }

    export function toString(opcode: Opcode): string {
        const str = Opcode[opcode];
        if (!str) return "NULL";
        return str;
    }

}