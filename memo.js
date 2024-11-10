const socket = new Socket("ws://localhost:8080");

socket.webSocket.addEventListener("open", () => startGame());

let myName = "";
let opponentName = "";
let myScore = 0;
let opponentScore = 0;

// Create HTML elements dynamically
const body = document.body;
const notificationContainer = document.createElement("div"); // Container for notifications
const gameContainer = document.createElement("div"); // Main game container
const questionElement = document.createElement("p");
const scoreElement = document.createElement("p");
const answerInput = document.createElement("input");

body.style.margin = "0";
body.style.display = "flex";
body.style.justifyContent = "center";
body.style.alignItems = "center";
body.style.height = "100vh";
body.style.flexDirection = "column";
body.style.fontFamily = "Arial, sans-serif";
body.style.backgroundColor = "#f4f4f4";
body.style.padding = "10px";
body.style.boxSizing = "border-box";
body.style.overflow = "hidden";

// Notification container styled for centering between question and top
notificationContainer.style.position = "absolute";
notificationContainer.style.top = "15%"; // Place it closer to the top but above the question
notificationContainer.style.left = "50%";
notificationContainer.style.transform = "translateX(-50%)";
notificationContainer.style.width = "100%";
notificationContainer.style.textAlign = "center";
notificationContainer.style.pointerEvents = "none"; // Prevent interaction
notificationContainer.style.zIndex = "100"; // Ensure it's above everything

// Game container for better responsiveness
gameContainer.style.display = "flex";
gameContainer.style.flexDirection = "column";
gameContainer.style.alignItems = "center";
gameContainer.style.justifyContent = "center";
gameContainer.style.width = "100%";
gameContainer.style.maxWidth = "600px"; // Limit width for larger screens
gameContainer.style.padding = "20px";
gameContainer.style.boxSizing = "border-box";

// Text and input styles
questionElement.style.fontSize = "clamp(1rem, 2vw, 1.5rem)";
scoreElement.style.fontSize = "clamp(0.8rem, 1.5vw, 1.2rem)";
scoreElement.style.margin = "10px 0";
answerInput.type = "text";
answerInput.placeholder = "Entrez votre réponse...";
answerInput.style.fontSize = "clamp(0.8rem, 1.5vw, 1.2rem)";
answerInput.style.margin = "10px";
answerInput.style.padding = "10px";
answerInput.style.width = "100%";
answerInput.style.maxWidth = "400px";
answerInput.style.boxSizing = "border-box";
answerInput.style.border = "1px solid #ccc";
answerInput.style.borderRadius = "5px";

// Append elements to the body
body.appendChild(notificationContainer);
body.appendChild(gameContainer);
gameContainer.appendChild(questionElement);
gameContainer.appendChild(scoreElement);
gameContainer.appendChild(answerInput);

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
    answerInput.focus();
};

socket.actions.updateScore = (socket, body) => {
    const { score } = body;
    const oldScore = myScore;
    myScore = score;
    scoreElement.innerHTML = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;

    if (myScore > oldScore) {
        createNotification("Bravo ! Vous avez bien répondu !", "success");
    } else if (myScore < oldScore) {
        createNotification("Oups ! Mauvaise réponse !", "failure");
    }
};

socket.actions.notification = (socket, body) => {
    const { message, type } = body;

    if (type === "opponentSuccess") {
        createNotification(`${opponentName} a bien répondu !`, "success");
    } else if (type === "opponentFailure") {
        createNotification(`${opponentName} s'est trompé !`, "failure");
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

function createNotification(message, type) {
    // Create a notification element
    const notificationElement = document.createElement("p");
    notificationElement.innerHTML = message;
    notificationElement.style.position = "relative";
    notificationElement.style.fontSize = "clamp(0.8rem, 1.5vw, 1.2rem)";
    notificationElement.style.fontWeight = "bold";
    notificationElement.style.color = type === "success" ? "green" : "red";
    notificationElement.style.margin = "5px 0";
    notificationElement.style.opacity = "1";
    notificationElement.style.transform = "translateY(0)";
    notificationElement.style.animation = "moveUp 2s ease-in-out forwards";

    // Append to the notification container
    notificationContainer.appendChild(notificationElement);

    // Remove the notification after animation ends
    setTimeout(() => {
        notificationElement.remove();
    }, 2000);
}

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
    @keyframes moveUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.8);
        }
    }

    @media (max-width: 768px) {
        body {
            padding: 20px;
        }
    }
`;
document.head.appendChild(style);
