function game() {
    const socket = new Socket("ws://localhost:8080");

    socket.webSocket.addEventListener("open", () => startGame());

    let myName = "";
    let opponentName = "";
    let myScore = 0;
    let opponentScore = 0;

    const body = document.body;
    const questionElement = document.createElement("p");
    const scoreElement = document.createElement("p");
    const answerInput = document.createElement("input");
    const notificationElement = document.createElement("p");

    body.appendChild(questionElement);
    body.appendChild(scoreElement);
    body.appendChild(answerInput);
    body.appendChild(notificationElement);

    answerInput.type = "text";
    answerInput.placeholder = "Entrez votre réponse...";
    answerInput.focus();

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
        answerInput.focus();
    };

    socket.actions.updateScore = (socket, body) => {
        const { score } = body;
        myScore = score;
        scoreElement.textContent = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;
    };

    socket.actions.notification = (socket, body) => {
        notificationElement.textContent = body.message;
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
}

game();
