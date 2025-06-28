const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 15;
let ballSpeedX = (Math.random() - 0.5) * 4;
let ballSpeedY = (Math.random() - 0.5) * 4;

// Hexagon parameters
const hexagonPoints = [
    { x: canvas.width / 2, y: 100 },
    { x: canvas.width / 2 + 150, y: 175 },
    { x: canvas.width / 2 + 150, y: 325 },
    { x: canvas.width / 2, y: 400 },
    { x: canvas.width / 2 - 150, y: 325 },
    { x: canvas.width / 2 - 150, y: 175 }
];

function drawHexagon() {
    ctx.beginPath();
    ctx.moveTo(hexagonPoints[0].x, hexagonPoints[0].y);
    for (let i = 1; i < hexagonPoints.length; i++) {
        ctx.lineTo(hexagonPoints[i].x, hexagonPoints[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4757';
    ctx.fill();
    ctx.closePath();
}

function update() {
    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off the hexagon walls
    for (let i = 0; i < hexagonPoints.length; i++) {
        const p1 = hexagonPoints[i];
        const p2 = hexagonPoints[(i + 1) % hexagonPoints.length];

        // Check collision with each edge of the hexagon
        if (isCollidingWithEdge(ballX, ballY, ballRadius, p1, p2)) {
            // Calculate normal vector to the edge
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const nx = dy / length;
            const ny = -dx / length;

            // Reflect velocity based on normal vector
            const dotProduct = ballSpeedX * nx + ballSpeedY * ny;
            ballSpeedX -= 2 * dotProduct * nx;
            ballSpeedY -= 2 * dotProduct * ny;

            // Move the ball out of the hexagon to prevent sticking
            const overlap = ballRadius - distanceToEdge(ballX, ballY, p1, p2);
            ballX += nx * overlap;
            ballY += ny * overlap;
        }
    }

    // Bounce off the canvas edges
    if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY > canvas.height - ballRadius || ballY + ballSpeedY < ballRadius) {
        ballSpeedY = -ballSpeedY;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw hexagon and ball
    drawHexagon();
    drawBall();

    requestAnimationFrame(update);
}

function distanceToEdge(x, y, p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq === 0) return 0;

    const t = ((x - p1.x) * dx + (y - p1.y) * dy) / lengthSq;
    const clampedT = Math.max(0, Math.min(1, t));
    const closestX = p1.x + clampedT * dx;
    const closestY = p1.y + clampedT * dy;

    return Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
}

function isCollidingWithEdge(x, y, radius, p1, p2) {
    return distanceToEdge(x, y, p1, p2) < radius;
}

update();
