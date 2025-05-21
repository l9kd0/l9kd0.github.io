class FallingObject {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = Math.random() * 3 + 2; // Random speed between 2 and 5
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    move(direction) {
        this.x += direction * 10; // Move 10 pixels left or right
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.size)); // Keep player within bounds
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 400;
canvas.height = 600;

const player = new Player(canvas.width / 2 - 25, canvas.height - 50, 50);
const fallingObjects = [];
let score = 0;

function spawnFallingObject() {
    const size = Math.random() * 30 + 20; // Random size between 20 and 50
    const x = Math.random() * (canvas.width - size);
    fallingObjects.push(new FallingObject(x, 0, size));
}

function checkCollision(object) {
    return (
        object.x < player.x + player.size &&
        object.x + object.size > player.x &&
        object.y < player.y + player.size &&
        object.y + object.size > player.y
    );
}
function showGameOverPopover(score) {
    const popover = document.getElementById('game-over-popover');
    const finalScore = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');

    finalScore.textContent = score;
    popover.style.display = 'block';

    restartBtn.addEventListener('click', () => {
        document.location.reload();
    });
}

function update() {
    if (Math.random() < 0.02) spawnFallingObject(); // Spawn a new object occasionally

    fallingObjects.forEach((object, index) => {
        object.update();
        if (checkCollision(object)) {
            showGameOverPopover(score); // Show popover instead of alert
            cancelAnimationFrame(gameLoop);
        }
        if (object.y > canvas.height) {
            fallingObjects.splice(index, 1);
            score++;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    fallingObjects.forEach(object => object.draw(ctx));
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 20);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        player.move(-1);
    } else if (event.key === 'ArrowRight') {
        player.move(1);
    }
});

gameLoop();