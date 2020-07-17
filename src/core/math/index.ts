/* eslint-disable */

declare global {
    interface Math {
        EPSILON: number;
    }
}

Math.EPSILON = 0.000001;

export class Vec2 extends Array<number> {

    private constructor(array: [number, number]) {
        super(...array);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public toArray(): Array<number> { return [this[0], this[1]]; }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public set x(value: number) { this[0] = value; }
    public set y(value: number) { this[1] = value; }

    /**
     * 
     * @param {[number,number,number]} array array of length 3
     * @returns {Vec2} resulting vector
     */
    public static create(array?: [number, number]): Vec2 {
        return new Vec2(array || [0, 0]);
    }

    /**
     * Creates a new vector from an existing one
     * @returns {Vec2} new vector
     */
    public clone(): Vec2 {
        return Vec2.create([this[0], this[1]]);
    }

    /**
     * Copies the values of one vector to another
     * @param {Vec2} out receiving vector
     */
    public copy(out: Vec2) {
        out[0] = this[0];
        out[1] = this[1];
    }

    /**
     * @returns {number} length of the vector
     */
    public len(): number {
        return Math.hypot(...this);
    }

    /**
     * Adds other vector to the receiving vector
     * @this {this} first operand
     * @param {Vec2} that second operand
     */
    public add(that: Vec2): this {
        this[0] = this[0] + that[0];
        this[1] = this[1] + that[1];

        return this;
    }

    /**
     * Subtracts other vector from the receiving vector
     * @this {this} first operand
     * @param {Vec2} that second operand
     */
    public sub(that: Vec2): this {
        this[0] = this[0] - that[0];
        this[1] = this[1] - that[1];

        return this;
    }

    /**
     * Multiples receiving vector by the other vector
     * @this {this} first operand
     * @param {Vec2} that second operand
     */
    public mult(that: Vec2): this {
        this[0] = this[0] * that[0];
        this[1] = this[1] * that[1];

        return this;
    }

    /**
     * Divides receiving vector by the other vector
     * @this {this} first operand
     * @param {Vec2} that second operand
     */
    public div(that: Vec2): this {
        if (that[0] === 0) throw new Error("Second operand has component 0!");
        if (that[1] === 0) throw new Error("Second operand has component 0!");
        this[0] = this[0] / that[0];
        this[1] = this[1] / that[1];

        return this;
    }

    /**
     * Applies Math.ceil to all components of the receiving vector
     * @this {this} vector to apply operation to
     */
    public ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);

        return this;
    }

    /**
     * Applies Math.floor to all components of the receiving vector
     * @this {this} vector to apply operation to
     */
    public floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);

        return this;
    }

    /**
     * Returns the length-wise min of two vectors
     * @param {Vec2} a first vector
     * @param {Vec2} b second vector
     */
    public static min(a: Vec2, b: Vec2): Vec2 {
        return (a.len() < b.len()) ? a : b;
    }

    /**
     * Returns the length-wise max of two vectors
     * @param {Vec2} a first vector
     * @param {Vec2} b second vector
     */
    public static max(a: Vec2, b: Vec2): Vec2 {
        return (a.len() > b.len()) ? a : b;
    }

    /**
     * Takes the min of each component of two vectors, creating a new vector
     * @param {Vec2} a first vector
     * @param {Vec2} b second vector
     */
    public static minc(a: Vec2, b: Vec2): Vec2 {
        let out = Vec2.create([
            Math.min(a[0], b[0]),
            Math.min(a[1], b[1])
        ]);
        return out;
    }

    /**
     * Takes the max of each component of two vectors, creating a new vector
     * @param {Vec2} a first vector
     * @param {Vec2} b second vector
     */
    public static maxc(a: Vec2, b: Vec2): Vec2 {
        let out = Vec2.create([
            Math.max(a[0], b[0]),
            Math.max(a[1], b[1])
        ]);
        return out;
    }

    /**
     * Scales receiving vector by some amount
     * @param {number} amount the amount to scale by
     */
    public scale(amount: number): this {
        this[0] = this[0] * amount;
        this[1] = this[1] * amount;

        return this;
    }

    /**
     * Calculate the distance between two vectors
     * @param that 
     * @returns {number} distance
     */
    public dist(that: Vec2): number {
        let x = that[0] - this[0];
        let y = that[1] - this[1];
        return Math.hypot(x, y);
    }

    /**
     * Component-wise negation of the receiving vector
     */
    public negate(): this {
        this[0] = -this[0];
        this[1] = -this[1];

        return this;
    }

    /**
     * Component-wise inversion of the receiving vector
     */
    public inverse(): this {
        this[0] = 1.0 / this[0];
        this[1] = 1.0 / this[1];

        return this;
    }

    /**
     * Normalize the receiving vector
     */
    public normalize(): this {
        let x = this[0];
        let y = this[1];
        let len = x * x + y * y;

        if (len > 0) len = 1 / Math.sqrt(len);

        this[0] = this[0] * len;
        this[1] = this[1] * len;

        return this;
    }

    /**
     * Calculate the dot product of two vectors
     * @this {this} first operand
     * @param {Vec2} that second operand
     */
    public dot(that: Vec2): number {
        return this[0] * that[0] + this[1] * that[1];
    }

    /**
     * Calculate the cross product of two vectors
     * @this {this} first operand
     * @param {Vec2} that second operand
     * @returns {Vec3} resulting vector
     */
    public cross(that: Vec2): Vec3 {
        var z = this[0] * that[1] - this[1] * that[0];
        let out = Vec3.create([0, 0, z]);
        return out;
    }

    /**
     * Linearly interpolate between two vectors, resulting in a new vector
     * @param {Vec2} a first operand
     * @param {Vec2} b second operand
     * @param {number} weight number in range 0~1
     * @returns {Vec2} resulting vector
     */
    public static lerp(a: Vec2, b: Vec2, weight: number): Vec2 {
        let out = Vec2.create([
            a[0] + weight * (b[0] - a[0]),
            a[1] + weight * (b[1] - a[1])
        ])
        return out;
    }

    /**
     * Generates a random vector of max length scale  
     * Returns a unit vector if no scale is given
     * @param {number} scale amount to scale final vector
     * @returns {Vec2} resulting vector
     */
    public static random(scale: number = 1.0): Vec2 {
        let r = Math.random() * 2.0 * Math.PI;
        let out = Vec2.create([Math.cos(r) * scale, Math.sin(r) * scale]);
        return out;
    }

    /**
     * Sets all components of the receiving vector to 0
     */
    public zero(): this {
        this[0] = 0;
        this[1] = 0;

        return this;
    }

    /**
     * Checks for strict equality between two vectors
     * @this {this} first operand
     * @param {Vec2} that second operand
     */
    public equals(that: Vec2): boolean {
        return this[0] === that[0] && this[1] === that[1];
    }

    public abs(): this {
        this[0] = Math.abs(this[0]);
        this[1] = Math.abs(this[1]);
        return this;
    }

    public nearlyEquals(that: Vec2, epsilon: number): boolean {
        let d = this.sub(that).abs();
        return d.x < epsilon && d.y < epsilon;
    }
}

export class Vec3 extends Array<number> {

    private constructor(array: [number, number, number]) {
        super(...array);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public toArray(): Array<number> { return [this[0], this[1], this[2]]; }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }
    public set x(value: number) { this[0] = value; }
    public set y(value: number) { this[1] = value; }
    public set z(value: number) { this[2] = value; }

    /**
     * 
     * @param {[number,number,number]} array array of length 3
     * @returns {Vec3} resulting vector
     */
    public static create(array?: [number, number, number]): Vec3 {
        return new Vec3(array || [0, 0, 0]);
    }

    /**
     * Creates a new vector from an existing one
     * @returns {Vec3} new vector
     */
    public clone(): Vec3 {
        return Vec3.create([this[0], this[1], this[2]]);
    }

    /**
     * Copies the values of one vector to another
     * @param {Vec3} out receiving vector
     */
    public copy(out: Vec3) {
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
    }

    /**
     * @returns {number} length of the vector
     */
    public len(): number {
        return Math.hypot(...this);
    }

    /**
     * Adds other vector to the receiving vector
     * @this {this} first operand
     * @param {Vec3} that second operand
     */
    public add(that: Vec3): this {
        this[0] = this[0] + that[0];
        this[1] = this[1] + that[1];
        this[2] = this[2] + that[2];

        return this;
    }

    /**
     * Subtracts other vector from the receiving vector
     * @this {this} first operand
     * @param {Vec3} that second operand
     */
    public sub(that: Vec3): this {
        this[0] = this[0] - that[0];
        this[1] = this[1] - that[1];
        this[2] = this[2] - that[2];

        return this;
    }

    /**
     * Multiples receiving vector by the other vector
     * @this {this} first operand
     * @param {Vec3} that second operand
     */
    public mult(that: Vec3): this {
        this[0] = this[0] * that[0];
        this[1] = this[1] * that[1];
        this[2] = this[2] * that[2];

        return this;
    }

    /**
     * Divides receiving vector by the other vector
     * @this {this} first operand
     * @param {Vec3} that second operand
     */
    public div(that: Vec3): this {
        if (that[0] === 0) throw new Error("Second operand has component 0!");
        if (that[1] === 0) throw new Error("Second operand has component 0!");
        if (that[2] === 0) throw new Error("Second operand has component 0!");
        this[0] = this[0] / that[0];
        this[1] = this[1] / that[1];
        this[2] = this[2] / that[2];

        return this;
    }

    /**
     * Applies Math.ceil to all components of the receiving vector
     * @this {this} vector to apply operation to
     */
    public ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);
        this[2] = Math.ceil(this[2]);

        return this;
    }

    /**
     * Applies Math.floor to all components of the receiving vector
     * @this {this} vector to apply operation to
     */
    public floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);
        this[2] = Math.floor(this[2]);

        return this;
    }

    /**
     * Returns the length-wise min of two vectors
     * @param {Vec3} a first vector
     * @param {Vec3} b second vector
     */
    public static min(a: Vec3, b: Vec3): Vec3 {
        return (a.len() < b.len()) ? a : b;
    }

    /**
     * Returns the length-wise max of two vectors
     * @param {Vec3} a first vector
     * @param {Vec3} b second vector
     */
    public static max(a: Vec3, b: Vec3): Vec3 {
        return (a.len() > b.len()) ? a : b;
    }

    /**
     * Takes the min of each component of two vectors, creating a new vector
     * @param {Vec3} a first vector
     * @param {Vec3} b second vector
     */
    public static minc(a: Vec3, b: Vec3): Vec3 {
        let out = Vec3.create();
        out[0] = Math.min(a[0], b[0]);
        out[1] = Math.min(a[1], b[1]);
        out[2] = Math.min(a[2], b[2]);
        return out;
    }

    /**
     * Takes the max of each component of two vectors, creating a new vector
     * @param {Vec3} a first vector
     * @param {Vec3} b second vector
     */
    public static maxc(a: Vec3, b: Vec3): Vec3 {
        let out = Vec3.create();
        out[0] = Math.max(a[0], b[0]);
        out[1] = Math.max(a[1], b[1]);
        out[2] = Math.max(a[2], b[2]);
        return out;
    }

    /**
     * Scales receiving vector by some amount
     * @param {number} amount the amount to scale by
     */
    public scale(amount: number): this {
        this[0] = this[0] * amount;
        this[1] = this[1] * amount;
        this[2] = this[2] * amount;

        return this;
    }

    /**
     * Calculate the distance between two vectors
     * @param that 
     * @returns {number} distance
     */
    public dist(that: Vec3): number {
        let x = that[0] - this[0];
        let y = that[1] - this[1];
        let z = that[2] - this[2];
        return Math.hypot(x, y, z);
    }

    /**
     * Component-wise negation of the receiving vector
     */
    public negate(): this {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];

        return this;
    }

    /**
     * Component-wise inversion of the receiving vector
     */
    public inverse(): this {
        this[0] = 1.0 / this[0];
        this[1] = 1.0 / this[1];
        this[2] = 1.0 / this[2];

        return this;
    }

    /**
     * Normalize the receiving vector
     */
    public normalize(): this {
        let x = this[0];
        let y = this[1];
        let z = this[2];
        let len = x * x + y * y + z * z;

        if (len > 0) len = 1 / Math.sqrt(len);

        this[0] = this[0] * len;
        this[1] = this[1] * len;
        this[2] = this[2] * len;

        return this;
    }

    /**
     * Calculate the dot product of two vectors
     * @this {this} first operand
     * @param {Vec3} that second operand
     */
    public dot(that: Vec3): number {
        return this[0] * that[0] + this[1] * that[1] + this[2] * that[2]
    }

    /**
     * Calculate the cross product of two vectors
     * @this {this} first operand
     * @param {Vec3} that second operand
     * @returns {Vec3} resulting vector
     */
    public cross(that: Vec3): Vec3 {
        let ax = this[0],
            ay = this[1],
            az = this[2];
        let bx = that[0],
            by = that[1],
            bz = that[2];
        let out = Vec3.create();
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }

    /**
     * Linearly interpolate between two vectors, resulting in a new vector
     * @param {Vec3} a first operand
     * @param {Vec3} b second operand
     * @param {number} weight number in range 0~1
     * @returns {Vec3} resulting vector
     */
    public static lerp(a: Vec3, b: Vec3, weight: number): Vec3 {
        let ax = a[0];
        let ay = a[1];
        let az = a[2];

        let out = Vec3.create();
        out[0] = ax + weight * (b[0] - ax);
        out[1] = ay + weight * (b[1] - ay);
        out[2] = az + weight * (b[2] - az);
        return out;
    }

    /**
     * Generates a random vector of max length scale  
     * Returns a unit vector if no scale is given
     * @param {number} scale amount to scale final vector
     * @returns {Vec3} resulting vector
     */
    public static random(scale: number = 1.0): Vec3 {
        let r = Math.random() * 2.0 * Math.PI;
        let z = Math.random() * 2.0 - 1.0;
        let zScale = Math.sqrt(1.0 - z * z) * scale;

        let out = Vec3.create();
        out[0] = Math.cos(r) * zScale;
        out[1] = Math.sin(r) * zScale;
        out[2] = z * scale;
        return out;
    }

    /**
     * Sets all components of the receiving vector to 0
     */
    public zero(): this {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;

        return this;
    }

    /**
     * Checks for strict equality between two vectors
     * @this {this} first operand
     * @param {Vec3} that second operand
     */
    public equals(that: Vec3): boolean {
        return this[0] === that[0] && this[1] === that[1] && this[2] === that[2];
    }

    public abs(): this {
        this[0] = Math.abs(this[0]);
        this[1] = Math.abs(this[1]);
        this[2] = Math.abs(this[2]);
        return this;
    }

    public nearlyEquals(that: Vec3, epsilon: number): boolean {
        let d = this.sub(that).abs();
        return d.x < epsilon && d.y < epsilon && d.z < epsilon;
    }
}

export class Vec4 extends Array<number> {

    private constructor(array: [number, number, number, number]) {
        super(...array);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public toArray(): Array<number> { return [this[0], this[1], this[2], this[3]]; }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }
    public get w(): number { return this[3]; }
    public set x(value: number) { this[0] = value; }
    public set y(value: number) { this[1] = value; }
    public set z(value: number) { this[2] = value; }
    public set w(value: number) { this[3] = value; }

    /**
     * 
     * @param {[number,number,number]} array array of length 3
     * @returns {Vec4} resulting vector
     */
    public static create(array?: [number, number, number, number]): Vec4 {
        return new Vec4(array || [0, 0, 0, 0]);
    }

    /**
     * Creates a new vector from an existing one
     * @returns {Vec4} new vector
     */
    public clone(): Vec4 {
        return Vec4.create([this[0], this[1], this[2], this[3]]);
    }

    /**
     * Copies the values of one vector to another
     * @param {Vec4} out receiving vector
     */
    public copy(out: Vec4) {
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
    }

    /**
     * @returns {number} length of the vector
     */
    public len(): number {
        return Math.hypot(...this);
    }

    /**
     * Adds other vector to the receiving vector
     * @this {this} first operand
     * @param {Vec4} that second operand
     */
    public add(that: Vec4): this {
        this[0] = this[0] + that[0];
        this[1] = this[1] + that[1];
        this[2] = this[2] + that[2];
        this[3] = this[3] + that[3];

        return this;
    }

    /**
     * Subtracts other vector from the receiving vector
     * @this {this} first operand
     * @param {Vec4} that second operand
     */
    public sub(that: Vec4): this {
        this[0] = this[0] - that[0];
        this[1] = this[1] - that[1];
        this[2] = this[2] - that[2];
        this[3] = this[3] - that[3];

        return this;
    }

    /**
     * Multiples receiving vector by the other vector
     * @this {this} first operand
     * @param {Vec4} that second operand
     */
    public mult(that: Vec4): this {
        this[0] = this[0] * that[0];
        this[1] = this[1] * that[1];
        this[2] = this[2] * that[2];
        this[3] = this[3] * that[3];

        return this;
    }

    /**
     * Divides receiving vector by the other vector
     * @this {this} first operand
     * @param {Vec4} that second operand
     */
    public div(that: Vec4): this {
        if (that[0] === 0) throw new Error("Second operand has component 0!");
        if (that[1] === 0) throw new Error("Second operand has component 0!");
        if (that[2] === 0) throw new Error("Second operand has component 0!");
        if (that[3] === 0) throw new Error("Second operand has component 0!");
        this[0] = this[0] / that[0];
        this[1] = this[1] / that[1];
        this[2] = this[2] / that[2];
        this[3] = this[3] / that[3];

        return this;
    }

    /**
     * Applies Math.ceil to all components of the receiving vector
     * @this {this} vector to apply operation to
     */
    public ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);
        this[2] = Math.ceil(this[2]);
        this[3] = Math.ceil(this[3]);

        return this;
    }

    /**
     * Applies Math.floor to all components of the receiving vector
     * @this {this} vector to apply operation to
     */
    public floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);
        this[2] = Math.floor(this[2]);
        this[3] = Math.floor(this[3]);

        return this;
    }

    /**
     * Returns the length-wise min of two vectors
     * @param {Vec4} a first vector
     * @param {Vec4} b second vector
     */
    public static min(a: Vec4, b: Vec4): Vec4 {
        return (a.len() < b.len()) ? a : b;
    }

    /**
     * Returns the length-wise max of two vectors
     * @param {Vec4} a first vector
     * @param {Vec4} b second vector
     */
    public static max(a: Vec4, b: Vec4): Vec4 {
        return (a.len() > b.len()) ? a : b;
    }

    /**
     * Takes the min of each component of two vectors, creating a new vector
     * @param {Vec4} a first vector
     * @param {Vec4} b second vector
     */
    public static minc(a: Vec4, b: Vec4): Vec4 {
        let out = Vec4.create([
            Math.min(a[0], b[0]),
            Math.min(a[1], b[1]),
            Math.min(a[2], b[2]),
            Math.min(a[3], b[3])
        ]);
        return out;
    }

    /**
     * Takes the max of each component of two vectors, creating a new vector
     * @param {Vec4} a first vector
     * @param {Vec4} b second vector
     */
    public static maxc(a: Vec4, b: Vec4): Vec4 {
        let out = Vec4.create([
            Math.max(a[0], b[0]),
            Math.max(a[1], b[1]),
            Math.max(a[2], b[2]),
            Math.max(a[3], b[3])
        ]);
        return out;
    }

    /**
     * Scales receiving vector by some amount
     * @param {number} amount the amount to scale by
     */
    public scale(amount: number): this {
        this[0] = this[0] * amount;
        this[1] = this[1] * amount;
        this[2] = this[2] * amount;
        this[3] = this[3] * amount;

        return this;
    }

    /**
     * Calculate the distance between two vectors
     * @param that 
     * @returns {number} distance
     */
    public dist(that: Vec4): number {
        let x = that[0] - this[0];
        let y = that[1] - this[1];
        let z = that[2] - this[2];
        let w = that[3] - this[3];
        return Math.hypot(x, y, z, w);
    }

    /**
     * Component-wise negation of the receiving vector
     */
    public negate(): this {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];
        this[3] = -this[3];

        return this;
    }

    /**
     * Component-wise inversion of the receiving vector
     */
    public inverse(): this {
        this[0] = 1.0 / this[0];
        this[1] = 1.0 / this[1];
        this[2] = 1.0 / this[2];
        this[3] = 1.0 / this[3];

        return this;
    }

    /**
     * Normalize the receiving vector
     */
    public normalize(): this {
        let x = this[0];
        let y = this[1];
        let z = this[2];
        let w = this[3];
        let len = x * x + y * y + z * z + w * w;

        if (len > 0) len = 1 / Math.sqrt(len);

        this[0] = this[0] * len;
        this[1] = this[1] * len;
        this[2] = this[2] * len;
        this[3] = this[3] * len;

        return this;
    }

    /**
     * Calculate the dot product of two vectors
     * @this {this} first operand
     * @param {Vec4} that second operand
     */
    public dot(that: Vec4): number {
        return this[0] * that[0]
            + this[1] * that[1]
            + this[2] * that[2]
            + this[3] * that[3];
    }

    /**
     * Calculate the cross product of three vectors in 4-dimensional space
     * @this {this} first operand
     * @param {Vec4} that second operand
     * @returns {Vec4} resulting vector
     */
    public static cross(a: Vec4, b: Vec4, c: Vec4): Vec4 {
        let u = a;
        let v = b;
        let w = c;
        let A = v[0] * w[1] - v[1] * w[0],
            B = v[0] * w[2] - v[2] * w[0],
            C = v[0] * w[3] - v[3] * w[0],
            D = v[1] * w[2] - v[2] * w[1],
            E = v[1] * w[3] - v[3] * w[1],
            F = v[2] * w[3] - v[3] * w[2];
        let G = u[0];
        let H = u[1];
        let I = u[2];
        let J = u[3];
        let out = Vec4.create([
            H * F - I * E + J * D,
            -(G * F) + I * C - J * B,
            G * E - H * C + J * A,
            -(G * D) + H * B - I * A
        ]);
        return out;
    }

    /**
     * Linearly interpolate between two vectors, resulting in a new vector
     * @param {Vec4} a first operand
     * @param {Vec4} b second operand
     * @param {number} weight number in range 0~1
     * @returns {Vec4} resulting vector
     */
    public static lerp(a: Vec4, b: Vec4, weight: number): Vec4 {
        let out = Vec4.create([
            a[0] + weight * (b[0] - a[0]),
            a[1] + weight * (b[1] - a[1]),
            a[2] + weight * (b[2] - a[2]),
            a[3] + weight * (b[3] - a[3])
        ]);
        return out;
    }

    /**
     * Generates a random vector of given scale  
     * Returns a unit vector if no scale is given  
     * Marsaglia, George. Choosing a Point from the Surface of a Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646. http://projecteuclid.org/euclid.aoms/1177692644
     * @param {number} scale amount to scale final vector
     * @returns {Vec4} resulting vector
     */
    public static random(scale: number = 1.0): Vec4 {
        let v1, v2, v3, v4;
        let s1, s2;

        do {
            v1 = Math.random() * 2 - 1;
            v2 = Math.random() * 2 - 1;
            s1 = v1 * v1 + v2 * v2;
        } while (s1 >= 1);

        do {
            v3 = Math.random() * 2 - 1;
            v4 = Math.random() * 2 - 1;
            s2 = v3 * v3 + v4 * v4;
        } while (s2 >= 1);

        var d = Math.sqrt((1 - s1) / s2);
        let out = Vec4.create([
            scale * v1,
            scale * v2,
            scale * v3 * d,
            scale * v4 * d
        ]);
        return out;
    }

    /**
     * Sets all components of the receiving vector to 0
     */
    public zero(): this {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;

        return this;
    }

    /**
     * Checks for strict equality between two vectors
     * @this {this} first operand
     * @param {Vec4} that second operand
     */
    public equals(that: Vec4): boolean {
        return this[0] === that[0] && this[1] === that[1] && this[2] === that[2] && this[3] === that[3];
    }

    public abs(): this {
        this[0] = Math.abs(this[0]);
        this[1] = Math.abs(this[1]);
        this[2] = Math.abs(this[2]);
        this[3] = Math.abs(this[3]);
        return this;
    }

    public nearlyEquals(that: Vec4, epsilon: number): boolean {
        let d = this.sub(that).abs();
        return d.x <= epsilon && d.y <= epsilon && d.z <= epsilon && d.w <= epsilon;
    }
}

export class Mat4 extends Array<number> {

    private constructor(array: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]) {
        super(...array);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public static create(array?: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]): Mat4 {
        return new Mat4(array || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    public static identity(): Mat4 {
        return new Mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    public clone(): Mat4 {
        let out = Mat4.create();
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
        out[4] = this[4];
        out[5] = this[5];
        out[6] = this[6];
        out[7] = this[7];
        out[8] = this[8];
        out[9] = this[9];
        out[10] = this[10];
        out[11] = this[11];
        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];
        return out;
    }

    public copy(out: Mat4): void {
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
        out[4] = this[4];
        out[5] = this[5];
        out[6] = this[6];
        out[7] = this[7];
        out[8] = this[8];
        out[9] = this[9];
        out[10] = this[10];
        out[11] = this[11];
        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];
    }

    public transpose(): Mat4 {
        let out = Mat4.create();
        out[0] = this[0];
        out[1] = this[4];
        out[2] = this[8];
        out[3] = this[12];
        out[4] = this[1];
        out[5] = this[5];
        out[6] = this[9];
        out[7] = this[13];
        out[8] = this[2];
        out[9] = this[6];
        out[10] = this[10];
        out[11] = this[14];
        out[12] = this[3];
        out[13] = this[7];
        out[14] = this[11];
        out[15] = this[15];
        return out;
    }

    public invert(): Mat4 | null {
        let a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        let a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7];
        let a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11];
        let a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }

        det = 1.0 / det;
        let out = Mat4.create();
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return out;
    }

    public adjoint(): Mat4 {
        let a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        let a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7];
        let a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11];
        let a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];
        let out = Mat4.create();
        out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
        out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
        out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
        out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
        out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
        out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
        out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
        out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
        return out;
    }

    public determinant(): number {
        let a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        let a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7];
        let a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11];
        let a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    public multiply(other: Mat4): Mat4 {
        let a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        let a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7];
        let a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11];
        let a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15]; // Cache only the current line of the second matrix

        let b0 = other[0],
            b1 = other[1],
            b2 = other[2],
            b3 = other[3];

        let out = Mat4.create();
        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other[4];
        b1 = other[5];
        b2 = other[6];
        b3 = other[7];
        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other[8];
        b1 = other[9];
        b2 = other[10];
        b3 = other[11];
        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other[12];
        b1 = other[13];
        b2 = other[14];
        b3 = other[15];
        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return out;
    }

    public translate(offset: Vec3): Mat4 {
        let x = offset[0],
            y = offset[1],
            z = offset[2];
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        let out = Mat4.create();
        if (this === out) {
            out[12] = this[0] * x + this[4] * y + this[8] * z + this[12];
            out[13] = this[1] * x + this[5] * y + this[9] * z + this[13];
            out[14] = this[2] * x + this[6] * y + this[10] * z + this[14];
            out[15] = this[3] * x + this[7] * y + this[11] * z + this[15];
        } else {
            a00 = this[0];
            a01 = this[1];
            a02 = this[2];
            a03 = this[3];
            a10 = this[4];
            a11 = this[5];
            a12 = this[6];
            a13 = this[7];
            a20 = this[8];
            a21 = this[9];
            a22 = this[10];
            a23 = this[11];
            out[0] = a00;
            out[1] = a01;
            out[2] = a02;
            out[3] = a03;
            out[4] = a10;
            out[5] = a11;
            out[6] = a12;
            out[7] = a13;
            out[8] = a20;
            out[9] = a21;
            out[10] = a22;
            out[11] = a23;
            out[12] = a00 * x + a10 * y + a20 * z + this[12];
            out[13] = a01 * x + a11 * y + a21 * z + this[13];
            out[14] = a02 * x + a12 * y + a22 * z + this[14];
            out[15] = a03 * x + a13 * y + a23 * z + this[15];
        }

        return out;
    }

    public scale(scale: Vec3) {
        let x = scale[0],
            y = scale[1],
            z = scale[2];
        let out = Mat4.create();
        out[0] = this[0] * x;
        out[1] = this[1] * x;
        out[2] = this[2] * x;
        out[3] = this[3] * x;
        out[4] = this[4] * y;
        out[5] = this[5] * y;
        out[6] = this[6] * y;
        out[7] = this[7] * y;
        out[8] = this[8] * z;
        out[9] = this[9] * z;
        out[10] = this[10] * z;
        out[11] = this[11] * z;
        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];
        return out;
    }

    public rotate(angle: number, axis: Vec3): Mat4 | null {
        let x = axis[0],
            y = axis[1],
            z = axis[2];
        let len = Math.hypot(x, y, z);
        let s, c, t;
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        let b00, b01, b02;
        let b10, b11, b12;
        let b20, b21, b22;

        if (len < Math.EPSILON) {
            return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        s = Math.sin(angle);
        c = Math.cos(angle);
        t = 1 - c;
        a00 = this[0];
        a01 = this[1];
        a02 = this[2];
        a03 = this[3];
        a10 = this[4];
        a11 = this[5];
        a12 = this[6];
        a13 = this[7];
        a20 = this[8];
        a21 = this[9];
        a22 = this[10];
        a23 = this[11]; // Construct the elements of the rotation matrix

        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

        let out = Mat4.create();
        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;

        if (this !== out) {
            // If the source and destination differ, copy the unchanged last row
            out[12] = this[12];
            out[13] = this[13];
            out[14] = this[14];
            out[15] = this[15];
        }

        return out;
    }

    public rotateX(angle: number): Mat4 | null {
        return this.rotate(angle, Vec3.create([1, 0, 0]));
    }

    public rotateY(angle: number): Mat4 | null {
        return this.rotate(angle, Vec3.create([0, 1, 0]));
    }

    public rotateZ(angle: number): Mat4 | null {
        return this.rotate(angle, Vec3.create([0, 0, 1]));
    }

    public static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
        let out = Mat4.create();
        let rl = 1 / (right - left);
        let tb = 1 / (top - bottom);
        let nf = 1 / (near - far);
        out[0] = near * 2 * rl;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = near * 2 * tb;
        out[6] = 0;
        out[7] = 0;
        out[8] = (right + left) * rl;
        out[9] = (top + bottom) * tb;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = far * near * 2 * nf;
        out[15] = 0;
        return out;
    }

    public static perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
        let out = Mat4.create();
        let f = 1.0 / Math.tan(fov / 2), nf;
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[15] = 0;

        if (far != null && far !== Infinity) {
            nf = 1 / (near - far);
            out[10] = (far + near) * nf;
            out[14] = 2 * far * near * nf;
        } else {
            out[10] = -1;
            out[14] = -2 * near;
        }

        return out;
    }

    public static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
        let out = Mat4.create();
        let lr = 1 / (left - right);
        let bt = 1 / (bottom - top);
        let nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
    }

    public static lookAt(eye: Vec3, center: Vec3, up: Vec3 = Vec3.create([0, 1, 0])): Mat4 {
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        var eyex = eye[0];
        var eyey = eye[1];
        var eyez = eye[2];
        var upx = up[0];
        var upy = up[1];
        var upz = up[2];
        var centerx = center[0];
        var centery = center[1];
        var centerz = center[2];

        if (Math.abs(eyex - centerx) < Math.EPSILON && Math.abs(eyey - centery) < Math.EPSILON && Math.abs(eyez - centerz) < Math.EPSILON) {
            return Mat4.identity();
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;
        len = 1 / Math.hypot(z0, z1, z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.hypot(x0, x1, x2);

        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.hypot(y0, y1, y2);

        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        let out = Mat4.create();
        out[0] = x0;
        out[1] = y0;
        out[2] = z0;
        out[3] = 0;
        out[4] = x1;
        out[5] = y1;
        out[6] = z1;
        out[7] = 0;
        out[8] = x2;
        out[9] = y2;
        out[10] = z2;
        out[11] = 0;
        out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out[15] = 1;
        return out;
    }

    public add(other: Mat4): Mat4 {
        let out = Mat4.create();
        out[0] = other[0] + this[0];
        out[1] = other[1] + this[1];
        out[2] = other[2] + this[2];
        out[3] = other[3] + this[3];
        out[4] = other[4] + this[4];
        out[5] = other[5] + this[5];
        out[6] = other[6] + this[6];
        out[7] = other[7] + this[7];
        out[8] = other[8] + this[8];
        out[9] = other[9] + this[9];
        out[10] = other[10] + this[10];
        out[11] = other[11] + this[11];
        out[12] = other[12] + this[12];
        out[13] = other[13] + this[13];
        out[14] = other[14] + this[14];
        out[15] = other[15] + this[15];
        return out;
    }

    public sub(other: Mat4): Mat4 {
        let out = Mat4.create();
        out[0] = this[0] - other[0];
        out[1] = this[1] - other[1];
        out[2] = this[2] - other[2];
        out[3] = this[3] - other[3];
        out[4] = this[4] - other[4];
        out[5] = this[5] - other[5];
        out[6] = this[6] - other[6];
        out[7] = this[7] - other[7];
        out[8] = this[8] - other[8];
        out[9] = this[9] - other[9];
        out[10] = this[10] - other[10];
        out[11] = this[11] - other[11];
        out[12] = this[12] - other[12];
        out[13] = this[13] - other[13];
        out[14] = this[14] - other[14];
        out[15] = this[15] - other[15];
        return out;
    }

    public multiplyScalar(scalar: number): Mat4 {
        let out = Mat4.create();
        out[0] = this[0] * scalar;
        out[1] = this[1] * scalar;
        out[2] = this[2] * scalar;
        out[3] = this[3] * scalar;
        out[4] = this[4] * scalar;
        out[5] = this[5] * scalar;
        out[6] = this[6] * scalar;
        out[7] = this[7] * scalar;
        out[8] = this[8] * scalar;
        out[9] = this[9] * scalar;
        out[10] = this[10] * scalar;
        out[11] = this[11] * scalar;
        out[12] = this[12] * scalar;
        out[13] = this[13] * scalar;
        out[14] = this[14] * scalar;
        out[15] = this[15] * scalar;
        return out;
    }
}

export class Quat extends Array<number> {


    private constructor(array: [number, number, number, number]) {
        super(...array);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * 
     * @param {[number,number,number]} array array of length 3
     * @returns {Quat} resulting quaternion
     */
    public static create(array?: [number, number, number, number]): Quat {
        return new Quat(array || [0, 0, 0, 0]);
    }

    public static identity(): Quat {
        return new Quat([0, 0, 0, 1]);
    }

    /**
     * Creates a new quaternion from an existing one
     * @returns {Quat} new quaternion
     */
    public clone(): Quat {
        return Quat.create([this[0], this[1], this[2], this[3]]);
    }

    /**
     * Copies the values of one quaternion to another
     * @param {Quat} out receiving quaternion
     */
    public copy(out: Quat) {
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
    }

    /**
     * Adds other quaternion to the receiving quaternion
     * @this {this} first operand
     * @param {Quat} that second operand
     */
    public add(that: Quat): this {
        this[0] = this[0] + that[0];
        this[1] = this[1] + that[1];
        this[2] = this[2] + that[2];
        this[3] = this[3] + that[3];

        return this;
    }

    /**
     * Subtracts other quaternion from the receiving quaternion
     * @this {this} first operand
     * @param {Quat} that second operand
     */
    public sub(that: Quat): this {
        this[0] = this[0] - that[0];
        this[1] = this[1] - that[1];
        this[2] = this[2] - that[2];
        this[3] = this[3] - that[3];

        return this;
    }

    /**
     * Scales receiving quaternion by some amount
     * @param {number} amount the amount to scale by
     */
    public scale(amount: number): this {
        this[0] = this[0] * amount;
        this[1] = this[1] * amount;
        this[2] = this[2] * amount;
        this[3] = this[3] * amount;

        return this;
    }

    /**
     * Normalize the receiving quaternion
     */
    public normalize(): this {
        let x = this[0];
        let y = this[1];
        let z = this[2];
        let w = this[3];
        let len = x * x + y * y + z * z + w * w;

        if (len > 0) len = 1 / Math.sqrt(len);

        this[0] = this[0] * len;
        this[1] = this[1] * len;
        this[2] = this[2] * len;
        this[3] = this[3] * len;

        return this;
    }

    /**
     * Calculate the dot product of two quaternions
     * @this {this} first operand
     * @param {Quat} that second operand
     */
    public dot(that: Quat): number {
        return this[0] * that[0]
            + this[1] * that[1]
            + this[2] * that[2]
            + this[3] * that[3];
    }

    /**
     * Linearly interpolate between two quaternions, resulting in a new quaternion
     * @param {Quat} a first operand
     * @param {Quat} b second operand
     * @param {number} weight number in range 0~1
     * @returns {Quat} resulting quaternion
     */
    public static lerp(a: Quat, b: Quat, weight: number): Quat {
        let out = Quat.create([
            a[0] + weight * (b[0] - a[0]),
            a[1] + weight * (b[1] - a[1]),
            a[2] + weight * (b[2] - a[2]),
            a[3] + weight * (b[3] - a[3])
        ]);
        return out;
    }

    public setAxisRotation(axis: Vec3, angle: number): Quat {
        angle = angle * 0.5;
        let s = Math.sin(angle);
        let out = Quat.create();
        out[0] = s * axis[0];
        out[1] = s * axis[1];
        out[2] = s * axis[2];
        out[3] = Math.cos(angle);
        return out;
    }

    public multiply(other: Quat): Quat {
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let bx = other[0],
            by = other[1],
            bz = other[2],
            bw = other[3];
        let out = Quat.create();
        out[0] = ax * bw + aw * bx + ay * bz - az * by;
        out[1] = ay * bw + aw * by + az * bx - ax * bz;
        out[2] = az * bw + aw * bz + ax * by - ay * bx;
        out[3] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }

    public rotateX(angle: number): Quat {
        angle *= 0.5;
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let bx = Math.sin(angle),
            bw = Math.cos(angle);
        let out = Quat.create();
        out[0] = ax * bw + aw * bx;
        out[1] = ay * bw + az * bx;
        out[2] = az * bw - ay * bx;
        out[3] = aw * bw - ax * bx;
        return out;
    }

    public rotateY(angle: number): Quat {
        angle *= 0.5;
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let by = Math.sin(angle),
            bw = Math.cos(angle);
        let out = Quat.create();
        out[0] = ax * bw - az * by;
        out[1] = ay * bw + aw * by;
        out[2] = az * bw + ax * by;
        out[3] = aw * bw - ay * by;
        return out;
    }

    public rotateZ(angle: number): Quat {
        angle *= 0.5;
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let bz = Math.sin(angle),
            bw = Math.cos(angle);
        let out = Quat.create();
        out[0] = ax * bw + ay * bz;
        out[1] = ay * bw - ax * bz;
        out[2] = az * bw + aw * bz;
        out[3] = aw * bw - az * bz;
        return out;
    }

    public exponential(): Quat {
        let x = this[0],
            y = this[1],
            z = this[2],
            w = this[3];
        let r = Math.sqrt(x * x + y * y + z * z);
        let et = Math.exp(w);
        let s = r > 0 ? et * Math.sin(r) / r : 0;
        let out = Quat.create();
        out[0] = x * s;
        out[1] = y * s;
        out[2] = z * s;
        out[3] = et * Math.cos(r);
        return out;
    }

    public ln(): Quat {
        var x = this[0],
            y = this[1],
            z = this[2],
            w = this[3];
        var r = Math.sqrt(x * x + y * y + z * z);
        var t = r > 0 ? Math.atan2(r, w) / r : 0;
        let out = Quat.create();
        out[0] = x * t;
        out[1] = y * t;
        out[2] = z * t;
        out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
        return out;
    }

    public pow(scale: number): Quat {
        let out = this.ln();
        out = out.scale(scale);
        out = out.exponential();
        return out;
    }

    public static slerp(a: Quat, b: Quat, amount: number): Quat {
        let ax = a[0],
            ay = a[1],
            az = a[2],
            aw = a[3];
        let bx = b[0],
            by = b[1],
            bz = b[2],
            bw = b[3];
        let omega, cosom, sinom, scale0, scale1;

        cosom = ax * bx + ay * by + az * bz + aw * bw;

        if (cosom < 0.0) {
            cosom = -cosom;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }


        if (1.0 - cosom > Math.EPSILON) {
            omega = Math.acos(cosom);
            sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - amount) * omega) / sinom;
            scale1 = Math.sin(amount * omega) / sinom;
        } else {
            // "from" and "to" quaternions are very close
            //  ... so we can do a linear interpolation
            scale0 = 1.0 - amount;
            scale1 = amount;
        } // calculate final values

        let out = Quat.create();
        out[0] = scale0 * ax + scale1 * bx;
        out[1] = scale0 * ay + scale1 * by;
        out[2] = scale0 * az + scale1 * bz;
        out[3] = scale0 * aw + scale1 * bw;
        return out;
    }

    public random(): Quat {
        let u1 = Math.random();
        let u2 = Math.random();
        let u3 = Math.random();
        let sqrt1MinusU1 = Math.sqrt(1 - u1);
        let sqrtU1 = Math.sqrt(u1);
        let out = Quat.create();
        out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
        out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
        out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
        out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
        return out;
    }

    public invert(): Quat {
        let a0 = this[0],
            a1 = this[1],
            a2 = this[2],
            a3 = this[3];
        let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        if (dot === 0) {
            return Quat.create([0, 0, 0, 0]);
        }
        let invDot = 1.0 / dot;
        let out = Quat.create();
        out[0] = -a0 * invDot;
        out[1] = -a1 * invDot;
        out[2] = -a2 * invDot;
        out[3] = a3 * invDot;
        return out;
    }

    public conjugate(): Quat {
        let out = Quat.create();
        out[0] = -this[0];
        out[1] = -this[1];
        out[2] = -this[2];
        out[3] = this[3];
        return out;
    }

    public fromEuler(x: number, y: number, z: number): Quat {
        var halfToRad = 0.5 * (Math.PI / 180);
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;
        var sx = Math.sin(x);
        var cx = Math.cos(x);
        var sy = Math.sin(y);
        var cy = Math.cos(y);
        var sz = Math.sin(z);
        var cz = Math.cos(z);
        let out = Quat.create();
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        return out;
    }

    public static getAngle(a: Quat, b: Quat): number {
        let dotp = a.dot(b);
        return Math.acos(2 * dotp * dotp - 1);
    }

    /**
     * Checks for strict equality between two vectors
     * @this {this} first operand
     * @param {Quat} that second operand
     */
    public equals(that: Quat): boolean {
        return this[0] === that[0] && this[1] === that[1] && this[2] === that[2] && this[3] === that[3];
    }
}
