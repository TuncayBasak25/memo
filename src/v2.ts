namespace Main {
    export interface V2 extends Vec2 {}
    export function V2(x: number, y: number) {
        return new Vec2(x, y) as V2;
    }
    class Vec2 {
        constructor(public x: number, public y: number) {}

        get dir() {
            return Math.atan2(this.y, this.x);
        }

        set dir(angle: number) {
            const mag = this.mag;
            this.x = Math.cos(angle) * mag;
            this.y = Math.sin(angle) * mag;
        }

        get magSquare() {
            return this.x ** 2 + this.y **2;
        }

        get mag() {
            return Math.sqrt(this.magSquare);
        }

        set mag(val: number) {
            if (val == 0)
                this.set(0, 0);
            else
                this.scale_mut(this.mag / val);
        }

        is_null() {
            return this.x == 0 && this.y == 0;
        }

        is_near_null(tolerance: number) {
            return this.mag < tolerance;
        }

        is_equal(other: V2) {
            return this.x == other.x && this.y == other.y;
        }

        is_near(other: V2, tolerance: number) {
            return other.sub(this).mag < tolerance;
        }

        copy() {
            return V2(this.x, this.y);
        }

        normalize() {
            return this.copy().normalize_mut();
        }

        normalize_mut() {
            const { dir } = this;
            return this.set(Math.cos(dir), Math.sin(dir));
        }

        set(x: number, y: number) {
            this.x = x;
            this.y = y;
            return this;
        }

        dot(other: V2) {
            return this.x * other.x + this.y * other.y;
        }

        cross(other: V2) {
            return this.x * other.y - this.y * other.x;
        }

        add(...rhsList: V2[]) {
            let {x, y} = this;
            for (const rhs of rhsList) {
                x += rhs.x;
                y += rhs.y;
            }
            return V2(x, y);
        }

        add_mut(...rhsList: V2[]) {
            for (const rhs of rhsList) {
                this.x += rhs.x;
                this.y += rhs.y;
            }
            return this;
        }

        sub(...rhsList: V2[]) {
            let {x, y} = this;
            for (const rhs of rhsList) {
                x -= rhs.x;
                y -= rhs.y;
            }
            return V2(x, y);
        }

        sub_mut(...rhsList: V2[]) {
            for (const rhs of rhsList) {
                this.x -= rhs.x;
                this.y -= rhs.y;
            }
            return this;
        }

        scale(val: number) {
            return V2(this.x * val, this.y * val);
        }

        scale_mut(val: number) {
            this.x *= val;
            this.y *= val;
            return this;
        }

        rotate(angle: number) {
            return this.copy().rotate_mut(angle);
        }

        rotate_mut(angle: number) {
            this.dir += angle;
            return this;
        }

        point_towards(target: V2) {
            return this.copy().point_towards_mut(target);
        }

        point_towards_mut(target: V2) {
            if (this.is_equal(target))
                return this;
            this.dir = target.sub(this).dir;
            return this;
        }
    }
}