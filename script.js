document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const gameOverEl = document.getElementById('gameOver');
    const restartBtn = document.getElementById('restartBtn');

    // Adjust canvas size for the screen
    canvas.width = Math.min(window.innerWidth - 40, 480);
    canvas.height = 400;

    // --- Game Variables ---
    let score;
    let ball;
    let paddle;
    let animationId; // To control the game loop

    // --- Game Objects ---
    function initialize() {
        // Reset score
        score = 0;
        scoreEl.textContent = score;
        
        // Hide game over screen
        gameOverEl.classList.add('hidden');

        // Ball properties
        ball = {
            x: canvas.width / 2,
            y: canvas.height - 50,
            radius: 10,
            dx: 2, // Speed in x-direction
            dy: -2 // Speed in y-direction
        };

        // Paddle properties
        paddle = {
            width: 80,
            height: 10,
            x: (canvas.width - 80) / 2,
            y: canvas.height - 20,
            speed: 8
        };
        
        // Start the game loop
        if (animationId) cancelAnimationFrame(animationId);
        gameLoop();
    }

    // --- Drawing Functions ---
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff69b4';
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.closePath();
    }

    // --- Movement and Collision ---
    function updateGame() {
        // Move the ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall collision (left/right)
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
        }

        // Wall collision (top)
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }

        // Paddle collision
        if (
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
        ) {
            ball.dy = -ball.dy;
            score++;
            scoreEl.textContent = score;
        }

        // Game Over condition (ball hits bottom)
        if (ball.y + ball.radius > canvas.height) {
            gameOver();
        }
    }
    
    function gameOver() {
        cancelAnimationFrame(animationId); // Stop the game
        gameOverEl.classList.remove('hidden');
    }

    // --- Main Game Loop ---
    function gameLoop() {
        // Clear the canvas for the next frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw everything
        drawBall();
        drawPaddle();

        // Update game state
        updateGame();

        // Request the next frame
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // --- Controls ---
    function movePaddle(event) {
        // Get the position of the touch/mouse inside the canvas
        const rect = canvas.getBoundingClientRect();
        let touchX;
        if (event.touches) {
            touchX = event.touches[0].clientX - rect.left;
        } else {
            touchX = event.clientX - rect.left;
        }

        // Move the center of the paddle to the touch position
        paddle.x = touchX - paddle.width / 2;

        // Prevent paddle from going off-screen
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    }

    // Event listeners for both mobile touch and desktop mouse
    canvas.addEventListener('touchmove', movePaddle);
    canvas.addEventListener('mousemove', movePaddle);
    restartBtn.addEventListener('click', initialize);

    // Start the game!
    initialize();
});
