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
    questionElement.textContent = "En attente d'un autre joueur...";
}

socket.actions.updateQuestion = (socket, body) => {
    const { prompt, opponentName: oppName, score, opponentScore: oppScore } = body;
    opponentName = oppName || "Adversaire";
    myScore = score;
    opponentScore = oppScore;

    questionElement.textContent = prompt;
    scoreElement.textContent = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;
    notificationElement.textContent = "";
    answerInput.focus();
};

socket.actions.updateScore = (socket, body) => {
    const { score } = body;
    const oldScore = myScore;
    myScore = score;
    scoreElement.textContent = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;

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
    element.textContent = message;
    element.style.color = type === "success" ? "green" : "red";
    element.style.fontWeight = "bold";

    // Apply animations
    if (type === "success") {
        element.style.animation = "bounce 0.8s ease-in-out";
    } else if (type === "failure") {
        element.style.animation = "shake 0.8s ease-in-out";
    }

    // Reset animation after it finishes
    setTimeout(() => {
        element.style.animation = "";
        element.textContent = ""; // Clear message after 2 seconds
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
