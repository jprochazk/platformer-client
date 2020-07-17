

import ECS from '../../src/core/ECS'


describe("ECS", function () {
    it("create() returns unique entity", function () {
        const registry = new ECS.Registry();

        const entity1 = registry.create();
        const entity2 = registry.create();

        expect(entity1)
            .not.toEqual(entity2)
    });

    it("get() throws for dead entity", function () {
        const registry = new ECS.Registry();
        const entity = registry.create();
        registry.destroy(entity);

        expect(() => { registry.get("test", entity) })
            .toThrowError(new Error(`Cannot get "test" component for dead entity ID 0`));
    });

    it("get() returns null if entity doesnt have component", function () {
        const registry = new ECS.Registry();
        const entity1 = registry.create();
        registry.emplace("test", entity1, {});
        const entity2 = registry.create();

        expect(registry.get("test", entity2))
            .toEqual(null);
    });

    it("get() updates the same component reference", function () {
        const registry = new ECS.Registry();
        const entity = registry.create();

        registry.emplace("test", entity, { prop: "property" });
        expect(registry.get("test", entity)!.prop)
            .toEqual("property");

        registry.get<{ prop: string }>("test", entity)!.prop = "hello";
        expect(registry.get("test", entity)!.prop)
            .toEqual("hello");
    });

    it("remove() throws for dead entity", function () {
        const registry = new ECS.Registry();
        const entity = registry.create();
        registry.destroy(entity);

        expect(() => { registry.remove("test", entity) })
            .toThrowError(new Error(`Cannot remove "test" component for dead entity ID 0`));
    });

    it("emplace() creates array for new component type", function () {
        const registry = new ECS.Registry();
        const entity = registry.create();

        registry.emplace("test", entity, {});

        const internal_map = new Map(); internal_map.set(0, {});
        //@ts-ignore accessing private property, typescript MAD 😡
        expect(registry.components.get("test"))
            .toStrictEqual(internal_map);
    });

    it("emplace() throws for dead entity", function () {
        const registry = new ECS.Registry();
        const entity = registry.create();
        registry.destroy(entity);

        expect(() => { registry.emplace("test", entity, {}); })
            .toThrowError(new Error(`Cannot set "test" component for dead entity ID 0`));
    });

    it("view() returns a series of entities", function () {
        const registry = new ECS.Registry();
        const A = {
            a: 0
        };
        const B = {
            b: 0
        };

        // make a few entities with some components
        const entities = [];
        for (let i = 0; i < 5; i++) {
            const entity = registry.create();

            // leave some out
            if (i !== 2) registry.emplace("a", entity, JSON.parse(JSON.stringify(A)) as typeof A);
            if (i !== 4) registry.emplace("b", entity, JSON.parse(JSON.stringify(B)) as typeof B);

            entities.push(entity);
        }


        const expectedViewEntities = [
            { entity: 0, a: { a: 0 }, b: { b: 0 } },
            { entity: 1, a: { a: 0 }, b: { b: 0 } },
            { entity: 3, a: { a: 0 }, b: { b: 0 } }
        ];

        const viewEntities: typeof expectedViewEntities = [];
        registry.view(["a", "b"]).each((entity: ECS.Entity, a: typeof A, b: typeof B) => {
            viewEntities.push({ entity, a, b });
        });

        expect(viewEntities).toEqual(expectedViewEntities);
    });

    it("view() returns all entities", function () {
        const registry = new ECS.Registry();
        const expectedViewEntities: ECS.Entity[] = [];
        for (let i = 0; i < 10; i++) {
            expectedViewEntities.push(registry.create());
        }

        const viewEntities: ECS.Entity[] = [];
        registry.view([]).each((entity: ECS.Entity) => {
            viewEntities.push(entity);
        });

        expect(viewEntities).toEqual(expectedViewEntities);
    });

    it("view() returns no entities", function () {
        const registry = new ECS.Registry();
        const expectedViewEntities: ECS.Entity[] = [];
        for (let i = 0; i < 10; i++) {
            expectedViewEntities.push(registry.create());
        }

        const viewEntities: ECS.Entity[] = [];
        registry.view(["test"]).each((entity: ECS.Entity) => {
            viewEntities.push(entity);
        });

        expect(viewEntities).toEqual(expectedViewEntities);
    });
});