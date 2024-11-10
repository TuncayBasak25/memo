const socket = new Socket("ws://localhost:8080");

socket.webSocket.addEventListener("open", () => startGame());

let myName = "";
let opponentName = "";
let myScore = 0;
let opponentScore = 0;

// Create HTML elements dynamically
const body = document.body;
const questionElement = document.createElement("p");
const scoreElement = document.createElement("p");
const answerInput = document.createElement("input");
const notificationElement = document.createElement("p");

body.style.margin = "0";
body.style.display = "flex";
body.style.justifyContent = "center";
body.style.alignItems = "center";
body.style.height = "100vh";
body.style.flexDirection = "column";
body.style.fontFamily = "Arial, sans-serif";
body.style.backgroundColor = "#f4f4f4";

questionElement.style.fontSize = "1.5rem";
scoreElement.style.fontSize = "1.2rem";
notificationElement.style.fontSize = "1.2rem";
notificationElement.style.marginTop = "10px";
notificationElement.style.textAlign = "center";
notificationElement.style.transition = "opacity 0.3s ease"; // Smooth fade-in/out
notificationElement.style.opacity = "1"; // Ensure it's visible

answerInput.type = "text";
answerInput.placeholder = "Entrez votre réponse...";
answerInput.style.fontSize = "1.2rem";
answerInput.style.margin = "10px";

body.appendChild(questionElement);
body.appendChild(scoreElement);
body.appendChild(answerInput);
body.appendChild(notificationElement);

function startGame() {
    myName = prompt("Entrez votre nom :");
    socket.sendAction("register", { name: myName });
    questionElement.innerHTML = "En attente d'un autre joueur...";
}

socket.actions.updateQuestion = (socket, body) => {
    const { prompt, opponentName: oppName, score, opponentScore: oppScore } = body;
    opponentName = oppName || "Adversaire";
    myScore = score;
    opponentScore = oppScore;

    questionElement.innerHTML = prompt;
    scoreElement.innerHTML = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;
    notificationElement.innerHTML = "";
    answerInput.focus();
};

socket.actions.updateScore = (socket, body) => {
    const { score } = body;
    const oldScore = myScore;
    myScore = score;
    scoreElement.innerHTML = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;

    if (myScore > oldScore) {
        animateFeedback(notificationElement, "Bravo ! Vous avez bien répondu !", "success");
    } else if (myScore < oldScore) {
        animateFeedback(notificationElement, "Oups ! Mauvaise réponse !", "failure");
    }
};

socket.actions.notification = (socket, body) => {
    const { message, type } = body;

    if (type === "opponentSuccess") {
        animateFeedback(notificationElement, `${opponentName} a bien répondu !`, "success");
    } else if (type === "opponentFailure") {
        animateFeedback(notificationElement, `${opponentName} s'est trompé !`, "failure");
    }
};

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const answer = answerInput.value.trim();
        if (answer) {
            socket.sendAction("submitAnswer", { answer });
            answerInput.value = "";
        }
    }
});

function animateFeedback(element, message, type) {
    console.log("Animating feedback:", message, type); // Debug message

    // Ensure element is visible before updating
    element.style.opacity = "1";
    element.innerHTML = message; // Use `innerHTML` to ensure content is displayed
    element.style.color = type === "success" ? "green" : "red";
    element.style.fontWeight = "bold";

    // Apply animations
    if (type === "success") {
        element.style.animation = "bounce 0.8s ease-in-out";
    } else if (type === "failure") {
        element.style.animation = "shake 0.8s ease-in-out";
    }

    // Reset animation and fade out message
    setTimeout(() => {
        element.style.animation = "";
        element.style.opacity = "0"; // Fade out smoothly
    }, 2000);
}

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
    }
`;
document.head.appendChild(style);
