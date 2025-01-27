"use strict";
var Main;
(function (Main) {
    on_init(() => {
        const image = new Image(innerWidth / 8, innerWidth / 8);
        image.src = "images/cat.webp";
        image.style.position = "absolute";
        image.style.borderRadius = "500px";
        image.style.left = (innerWidth - image.width) / 2 + "px";
        image.style.top = (innerHeight - image.height) / 2 + "px";
        document.body.appendChild(image);
        window.onresize = () => {
            image.width = innerWidth / 8;
            image.height = innerWidth / 8;
            image.style.left = (innerWidth - image.width) / 2 + "px";
            image.style.top = (innerHeight - image.height) / 2 + "px";
        };
        let angle = 0;
        on_update(() => {
            angle += Main.deltaT / 1000;
            image.style.transform = `rotate(${angle}rad)`;
        });
    });
})(Main || (Main = {}));
var inits;
var updates;
var resets;
function on_init(init) {
    inits !== null && inits !== void 0 ? inits : (inits = []);
    inits.push(init);
}
function on_update(update) {
    updates !== null && updates !== void 0 ? updates : (updates = []);
    updates.push(update);
}
function on_reset(reset) {
    resets !== null && resets !== void 0 ? resets : (resets = []);
    resets.push(reset);
}
var Main;
(function (Main) {
    inits !== null && inits !== void 0 ? inits : (inits = []);
    updates !== null && updates !== void 0 ? updates : (updates = []);
    resets !== null && resets !== void 0 ? resets : (resets = []);
    Main.running = true;
    let is_reset = false;
    Main.reset = () => is_reset = true;
    Main.deltaT = 0;
    let start = 0;
    function main() {
        for (const init of inits)
            init();
        loop();
    }
    function loop() {
        if (is_reset) {
            for (const reset of resets)
                reset();
            is_reset = false;
        }
        const end = Date.now();
        Main.deltaT = start == 0 ? 0 : end - start;
        start = end;
        for (const update of updates)
            update();
        requestAnimationFrame(loop);
    }
    window.onload = main;
})(Main || (Main = {}));
var Main;
(function (Main) {
    function V2(x, y) {
        return new Vec2(x, y);
    }
    Main.V2 = V2;
    class Vec2 {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        get dir() {
            return Math.atan2(this.y, this.x);
        }
        set dir(angle) {
            const mag = this.mag;
            this.x = Math.cos(angle) * mag;
            this.y = Math.sin(angle) * mag;
        }
        get magSquare() {
            return this.x ** 2 + this.y ** 2;
        }
        get mag() {
            return Math.sqrt(this.magSquare);
        }
        set mag(val) {
            if (val == 0)
                this.set(0, 0);
            else
                this.scale_mut(this.mag / val);
        }
        is_null() {
            return this.x == 0 && this.y == 0;
        }
        is_near_null(tolerance) {
            return this.mag < tolerance;
        }
        is_equal(other) {
            return this.x == other.x && this.y == other.y;
        }
        is_near(other, tolerance) {
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
        set(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
        dot(other) {
            return this.x * other.x + this.y * other.y;
        }
        cross(other) {
            return this.x * other.y - this.y * other.x;
        }
        add(...rhsList) {
            let { x, y } = this;
            for (const rhs of rhsList) {
                x += rhs.x;
                y += rhs.y;
            }
            return V2(x, y);
        }
        add_mut(...rhsList) {
            for (const rhs of rhsList) {
                this.x += rhs.x;
                this.y += rhs.y;
            }
            return this;
        }
        sub(...rhsList) {
            let { x, y } = this;
            for (const rhs of rhsList) {
                x -= rhs.x;
                y -= rhs.y;
            }
            return V2(x, y);
        }
        sub_mut(...rhsList) {
            for (const rhs of rhsList) {
                this.x -= rhs.x;
                this.y -= rhs.y;
            }
            return this;
        }
        scale(val) {
            return V2(this.x * val, this.y * val);
        }
        scale_mut(val) {
            this.x *= val;
            this.y *= val;
            return this;
        }
        rotate(angle) {
            return this.copy().rotate_mut(angle);
        }
        rotate_mut(angle) {
            this.dir += angle;
            return this;
        }
        point_towards(target) {
            return this.copy().point_towards_mut(target);
        }
        point_towards_mut(target) {
            if (this.is_equal(target))
                return this;
            this.dir = target.sub(this).dir;
            return this;
        }
    }
})(Main || (Main = {}));
const wordVisuals = [
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
    "./images/cat.webp",
];
