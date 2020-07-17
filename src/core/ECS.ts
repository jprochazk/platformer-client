

function* viewGenerator(
    components: Map<string, Map<ECS.Entity, ECS.Component>>,
    entityIterator: Iterable<ECS.Entity>,
    types: string[]
): Generator<{ entity: ECS.Entity, components: Array<ECS.Component> }> {
    nextEntity:
    for (const entity of entityIterator) {
        const entityObj = { entity, components: new Array<ECS.Component>() };

        for (const type of types) {
            if (!components.get(type)) continue;
            if (!(components.get(type)!.has(entity))) {
                // break out of both loops using a label
                continue nextEntity;
            }
            entityObj.components.push(components.get(type)!.get(entity)!);
        }

        yield entityObj;
    }
}

export namespace ECS {
    /**
     * An opaque identifier used to access component arrays
     */
    export type Entity = number;

    /**
     * Stores arbitrary data
     */
    export interface Component {
        [idx: string]: any;
    }

    /**
     * Stores arbitrary logic  
     */
    export interface System {
        /**
         * Called on each world update
         */
        update(registry: ECS.Registry): void;
    }

    export class EntityView {
        constructor(
            private readonly iterator: Iterable<{ entity: Entity; components: Component[]; }>
        ) { }

        each(callback: (entity: Entity, ...components: any[]) => void) {
            for (const e of this.iterator) {
                callback(e.entity, ...e.components);
            }
        }
    }

    /**
     * Registry holds all components in arrays
     *
     * Component types must be registered first
     */
    export class Registry {
        private entitySequence: Entity = 0;
        private entities: Set<Entity> = new Set();

        private components: Map<string, Map<Entity, Component>> = new Map();

        insert(entity: Entity) {
            if (this.entities.has(entity)) {
                throw new Error(`Cannot re-use entity ID ${entity}`);
            }

            this.entities.add(entity);
        }

        create(): Entity {
            const entity = this.entitySequence++;
            this.entities.add(entity);
            return entity;
        }

        alive(entity: Entity): boolean {
            return this.entities.has(entity);
        }

        destroy(entity: Entity) {
            this.entities.delete(entity);
            // delete all component instances for this entity
            for (const type of Object.keys(this.components)) {
                this.components.get(type)?.delete(entity);
            }
        }

        /**
         * Retrieves component of type `type` for `entity`
         */
        get<T extends Component>(type: string, entity: Entity): T | null {
            // can't get for "dead" entity
            if (!this.entities.has(entity)) {
                throw new Error(`Cannot get "${type}" component for dead entity ID ${entity}`);
            }

            const component = this.components.get(type)?.get(entity);
            if (component === undefined) {
                return null;
            }

            return component as T;
        }

        has(type: string, entity: Entity) {
            return this.components.get(type)?.has(entity) ?? false;
        }

        /**
         * Set `entity`'s instance of component `type` to `component`
         */
        emplace<T extends Component>(
            type: string,
            entity: Entity,
            component: T
        ) {
            // can't set for "dead" entity
            if (!this.entities.has(entity)) {
                throw new Error(`Cannot set "${type}" component for dead entity ID ${entity}`);
            }
            // ensure that this component type exists
            if (!this.components.has(type)) {
                this.components.set(type, new Map());
            }
            // then we can set it
            this.components.get(type)!.set(entity, component);
        }

        emplace_or_update<T extends Component>(
            type: string,
            entity: Entity,
            constructor: (...args: any[]) => T,
            updater: (component: T, ...args: any[]) => void,
            ...args: any[]
        ) {
            // can't set for "dead" entity
            if (!this.entities.has(entity)) {
                throw new Error(`Cannot set "${type}" component for dead entity ID ${entity}`);
            }
            // ensure that this component type exists
            if (!this.components.has(type)) {
                this.components.set(type, new Map());
            }
            // try get set or update
            const list = this.components.get(type)!;
            const component = list.get(entity) as T;
            if (!component) {
                list.set(entity, constructor(...args));
            } else {
                updater(component, ...args);
            }
        }

        /**
         * Removes component `type` for `entity`, returning the component
         */
        remove(type: string, entity: Entity) {
            // can't remove for "dead" entity
            if (!this.entities.has(entity)) {
                throw new Error(`Cannot remove "${type}" component for dead entity ID ${entity}`);
            }

            if (!this.components.has(type)) {
                return;
            }
            this.components.get(type)!.delete(entity);
        }

        view(types: string[]): EntityView {
            return new EntityView(viewGenerator(this.components, this.entities.values(), types));
        }

        size(): number {
            return this.entities.size;
        }

        static id(entity: Entity): number {
            return entity & 0b00000000_00000000_11111111_11111111
        }
        static version(entity: Entity): number {
            return entity & 0b11111111_11111111_00000000_00000000
        }
    }
}

export default ECS;