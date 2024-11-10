Socket.actions.submitAnswer = (socket: Socket, body: { answer?: string }) => {
    const game = games.find(
        g => g.player1.id === socket.id || g.player2.id === socket.id
    );

    if (!game) {
        return socket.sendError('You are not in an active game.');
    }

    const { player1, player2 } = game;
    const player = player1.id === socket.id ? player1 : player2;
    const opponent = player1.id === socket.id ? player2 : player1;

    const { answer } = body;
    if (!answer) {
        return socket.sendError('Answer is required.');
    }

    const correctIndex = game.currentQuestionIndex;
    const correctWord = words[correctIndex];
    const isCorrect =
        parseInt(answer) === correctIndex || answer.toLowerCase() === correctWord.toLowerCase();

    const currentTime = Date.now();
    const responseTime = (currentTime - (player.startTime || 0)) / 1000; // Response time in seconds

    if (isCorrect) {
        let points = 1;
        if (responseTime <= 3) points = 10;
        else if (responseTime <= 10) points = 10 - Math.floor(responseTime - 3);

        player.score += points;

        player.socket.sendAction('updateScore', { score: player.score });
        opponent.socket.sendAction('updateScore', { score: opponent.score });

        player.socket.sendAction('notification', {
            message: `Correct! You gain ${points} points.`,
        });
        opponent.socket.sendAction('notification', {
            message: `${player.name} answered correctly!`,
            type: 'opponentSuccess',
        });

        player.startTime = undefined;
    } else {
        player.score -= 10;

        player.socket.sendAction('updateScore', { score: player.score });
        opponent.socket.sendAction('updateScore', { score: opponent.score });

        player.socket.sendAction('notification', {
            message: `Wrong! You lose 10 points.`,
        });
        opponent.socket.sendAction('notification', {
            message: `${player.name} answered incorrectly.`,
            type: 'opponentFailure',
        });
    }

    askNextQuestion(game);
};
