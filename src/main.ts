type Fn = () => void;


var inits: Fn[];
var updates: Fn[];
var resets: Fn[];

function on_init(init: Fn) {
    inits ??= [];
    inits.push(init);
}
function on_update(update: Fn) {
    updates ??= [];
    updates.push(update);
}
function on_reset(reset: Fn) {
    resets ??= [];
    resets.push(reset);
}

namespace Main {

    inits ??= [];
    updates ??= [];
    resets ??= [];

    export let running = true;
    
    let is_reset = false;
    export const reset = () => is_reset = true;
    
    export let deltaT = 0;
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
        deltaT = start == 0 ? 0 : end - start;
        start = end;
        for (const update of updates)
            update();
        requestAnimationFrame(loop);
    }

    window.onload = main;
}