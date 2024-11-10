document.addEventListener("DOMContentLoaded", () => {
    // Initialize WebSocket connection
    const socket = new Socket("ws://localhost:8080");

    // Wait for WebSocket connection to open before starting the game
    socket.webSocket.addEventListener("open", () => {
        console.log("WebSocket connection established.");
        startGame();
    });

    // Game state
    let isMyTurn = false;
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
    const submitButton = document.createElement("button");
    const notificationElement = document.createElement("p");

    questionElement.style.fontSize = "1.5rem";
    scoreElement.style.fontSize = "1.2rem";
    notificationElement.style.fontSize = "1.2rem";

    answerInput.type = "text";
    answerInput.placeholder = "Enter your answer...";
    answerInput.style.fontSize = "1.2rem";
    answerInput.style.margin = "10px";

    submitButton.textContent = "Submit";
    submitButton.style.fontSize = "1.2rem";
    submitButton.style.padding = "10px 20px";

    // Add components to the body
    body.appendChild(questionElement);
    body.appendChild(scoreElement);
    body.appendChild(answerInput);
    body.appendChild(submitButton);
    body.appendChild(notificationElement);

    // Disable input and button initially
    answerInput.disabled = true;
    submitButton.disabled = true;

    // Prompt player to enter their name
    function startGame() {
        myName = prompt("Enter your name:");
        if (!myName) {
            alert("Name is required to start the game.");
            return startGame();
        }

        // Register the player with the server
        socket.sendAction("register", { name: myName });
        questionElement.textContent = "Waiting for another player...";
        scoreElement.textContent = "";
        notificationElement.textContent = "";
    }

    // Handle WebSocket actions
    socket.actions.updateQuestion = (socket, body) => {
        const { prompt, isMyTurn: turn, score, opponentScore: oppScore, playerName, opponentName: oppName } = body;

        isMyTurn = turn;
        opponentName = oppName;
        myScore = score;
        opponentScore = oppScore;

        questionElement.textContent = prompt;
        scoreElement.textContent = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;
        notificationElement.textContent = "";

        // Enable or disable input and button based on turn
        answerInput.disabled = !isMyTurn;
        submitButton.disabled = !isMyTurn;
    };

    socket.actions.notification = (socket, body) => {
        const { message, score, opponentScore: oppScore } = body;

        myScore = score;
        opponentScore = oppScore;

        scoreElement.textContent = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;
        notificationElement.textContent = message;
    };

    socket.actions.endGame = (socket, body) => {
        const { message, finalScore, opponentScore: oppScore } = body;

        myScore = finalScore;
        opponentScore = oppScore;

        questionElement.textContent = message;
        scoreElement.textContent = `${myName}: ${myScore} | ${opponentName}: ${opponentScore}`;
        notificationElement.textContent = "Game Over!";

        // Disable input and button
        answerInput.disabled = true;
        submitButton.disabled = true;
    };

    // Handle submit button click
    submitButton.addEventListener("click", () => {
        const answer = answerInput.value.trim();
        if (!answer) {
            notificationElement.textContent = "Please enter an answer.";
            return;
        }

        // Send the answer to the server
        socket.sendAction("submitAnswer", { answer });
        answerInput.value = "";
    });
});
