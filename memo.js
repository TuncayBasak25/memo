function game() {
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

        // Add animations based on score changes
        if (myScore > oldScore) {
            animateSuccess(notificationElement, "Bravo ! Vous avez bien répondu !");
        } else if (myScore < oldScore) {
            animateFailure(notificationElement, "Oups ! Mauvaise réponse !");
        }
    };

    socket.actions.notification = (socket, body) => {
        const { message, type } = body;
        notificationElement.textContent = message;

        // Opponent animations
        if (type === "opponentSuccess") {
            animateSuccess(notificationElement, `${opponentName} a bien répondu !`);
        } else if (type === "opponentFailure") {
            animateFailure(notificationElement, `${opponentName} s'est trompé !`);
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

    function animateSuccess(element, message) {
        element.textContent = message;
        element.style.color = "green";
        element.style.fontWeight = "bold";
        element.style.animation = "bounce 0.5s ease-in-out";
        resetAnimation(element);
    }

    function animateFailure(element, message) {
        element.textContent = message;
        element.style.color = "red";
        element.style.fontWeight = "bold";
        element.style.animation = "shake 0.5s ease-in-out";
        resetAnimation(element);
    }

    function resetAnimation(element) {
        setTimeout(() => {
            element.style.animation = "";
        }, 500);
    }
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

// Call the game function to start the application
game();
