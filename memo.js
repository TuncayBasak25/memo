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

answerInput.type = "text";
answerInput.placeholder = "Entrez votre réponse...";
answerInput.style.fontSize = "1.2rem";
answerInput.style.margin = "10px";

body.appendChild(questionElement);
body.appendChild(scoreElement);
body.appendChild(answerInput);

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
    // Create a temporary notification element
    const notificationElement = document.createElement("p");
    notificationElement.innerHTML = message;
    notificationElement.style.fontSize = "1.2rem";
    notificationElement.style.fontWeight = "bold";
    notificationElement.style.color = type === "success" ? "green" : "red";
    notificationElement.style.marginTop = "10px";
    notificationElement.style.textAlign = "center";
    notificationElement.style.animation = type === "success" ? "bounce 0.8s ease-in-out" : "shake 0.8s ease-in-out";

    // Append to the body
    body.appendChild(notificationElement);

    // Remove the notification after the animation ends
    setTimeout(() => {
        notificationElement.remove();
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
