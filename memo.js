const socket = new Socket("wss://basak-memo-api-8ed79b1768fd.herokuapp.com");

socket.webSocket.addEventListener("open", () => startGame());

let myName = "";
let opponentName = "";
let myScore = 0;
let opponentScore = 0;

// Create HTML elements dynamically
const body = document.body;
const notificationContainer = document.createElement("div"); // Container for notifications
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

// Notification container
notificationContainer.style.width = "100%";
notificationContainer.style.textAlign = "center";
notificationContainer.style.marginBottom = "10px"; // Space between notification and question

questionElement.style.fontSize = "1.5rem";
questionElement.style.marginTop = "10px"; // Space for a clean layout
scoreElement.style.fontSize = "1.2rem";
scoreElement.style.margin = "20px 0";

answerInput.type = "text";
answerInput.placeholder = "Entrez votre réponse...";
answerInput.style.fontSize = "1.2rem";
answerInput.style.margin = "10px";

// Append elements to the body
body.appendChild(notificationContainer);
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
    // Create a notification element
    const notificationElement = document.createElement("p");
    notificationElement.innerHTML = message;
    notificationElement.style.position = "relative";
    notificationElement.style.fontSize = "1.2rem";
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
`;
document.head.appendChild(style);
