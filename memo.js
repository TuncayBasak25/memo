const socket = new Socket("ws://localhost:8080");
//const socket = new Socket("wss://basak-memo-api-8ed79b1768fd.herokuapp.com");

function dispatchKeyEventFromKeyCode(keyCode) {
    const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: keyCode, // Legacy property
        which: keyCode,   // Used to match the keyCode value
    });

    // Dispatch the event
    document.dispatchEvent(event);
}



socket.actions.keydown = (socket, key) => {
    dispatchKeyEventFromKeyCode(key);
}

document.addEventListener("keydown", ({which}) => {
    socket.sendAction("keydown", which);
});