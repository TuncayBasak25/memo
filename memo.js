function game() {
    // Initialize WebSocket connection
    const socket = new Socket("ws://localhost:8080");

    // Wait for WebSocket connection to open before starting the game
    socket.webSocket.addEventListener("open", () => {
        console.log("Connexion WebSocket établie.");
        startGame();
    });

    // Game state
    let myName = "";
    let opponentName = "";
    let myScore = 0;
    let opponentScore = 0;

    // Create HTML elements dynamically
    const body = document.body;
    body.style.margin = "0";
    body.style.display = "flex";
    body.style.justifyContent = "center";
    body.style.alignItems = "center";
    body.style.height = "100vh";
    body.style.flexDirection = "column";
    body.style.fontFamily = "Arial, sans-serif";
    body.style.backgroundColor = "#f4f4f4";

    // Create UI components
    const questionElement = document.createElement("p");
    const scoreElement = document.createElement("p");
    const answerInput = document.createElement("input");
    const notificationElement = document.createElement("p");

    questionElement.style.fontSize = "1.5rem";
    scoreElement.style.fontSize = "1.2rem";
    notificationElement.style.fontSize = "1.2rem";

    answerInput.type = "text";
    answerInput.placeholder = "Entrez votre réponse...";
    answerInput.style.fontSize = "1.2rem";
    answerInput.style.margin = "10px";

    // Add components to the body
    body.appendChild(questionElement);
    body.appendChild(scoreElement);
    body.appendChild(answerInput);
    body.appendChild(notificationElement);

    // Ensure input is always writable
    answerInput.removeAttribute("disabled");

    // Prompt player to enter their name
    function startGame() {
        myName = prompt("Entrez votre nom :");
        if (!myName) {
            alert("Un nom est requis pour commencer la partie.");
            return startGame();
        }

        // Register the player with the server
        socket.sendAction("register", { name: myName });
        questionElement.textContent = "En attente d'un autre joueur...";
        scoreElement.textContent = "";
        notificationElement.textContent = "";
    }

    // Handle WebSocket actions
    socket.actions.updateQuestion = (socket, body) => {
        const { prompt, score, opponentScore: oppScore, playerName, opponentName: oppName } = body;

        opponentName = oppName || "Adversaire";
        myScore = score || 0;
        opponentScore = oppScore || 0;

        questionElement.textContent = prompt;
        scoreElement.textContent = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;
        notificationElement.textContent = "";
    };

    socket.actions.notification = (socket, body) => {
        const { message, score, opponentScore: oppScore } = body;

        myScore = score || 0;
        opponentScore = oppScore || 0;

        scoreElement.textContent = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;
        notificationElement.textContent = message;
    };

    socket.actions.endGame = (socket, body) => {
        const { message, finalScore, opponentScore: oppScore } = body;

        myScore = finalScore || 0;
        opponentScore = oppScore || 0;

        questionElement.textContent = message;
        scoreElement.textContent = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;
        notificationElement.textContent = "Partie terminée !";
    };

    // Handle keydown events for automatic input and submission
    document.addEventListener("keydown", (event) => {
        // Ignore system keys
        if (event.key === "Enter") {
            // Submit answer
            const answer = answerInput.value.trim();
            if (!answer) {
                notificationElement.textContent = "Veuillez entrer une réponse.";
                return;
            }

            socket.sendAction("submitAnswer", { answer });
            answerInput.value = "";
        } else if (event.key.length === 1) {
            // Write directly into the input
            answerInput.value += event.key;
        }
    });
}

// Call the game function to start the application
game();
