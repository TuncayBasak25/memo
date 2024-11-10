document.body.innerHTML = "";

const carre = document.createElement("div");
const s = carre.style;

s.position = "absolute";
s.backgroundColor = "magenta";
s.width = "200px";
s.height = "200px";

const socket = new Socket("wss://localhost:8080");

let x = 0;
let y = 0;

function loop() {
    if (socket.data.get("left")) {
        x -= 5;
    }
    if (socket.data.get("rigth")) {
        x += 5;
    }
    if (socket.data.get("up")) {
        y -= 5;
    }
    if (socket.data.get("down")) {
        y += 5;
    }

    s.left = x + "px";
    s.top = y + "px";

    setTimeout(() => loop(), 50);
}

document.addEventListener("keydown", ({which}) => {
    if (![37, 38, 39, 40].includes(which)) return;

    socket.sendAction("keypress", which);
})

document.addEventListener("keyup", ({which}) => {
    if (![37, 38, 39, 40].includes(which)) return;

    socket.sendAction("keyrelease", which);
})