class FallingObject {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = Math.random() * 5 + 2;

        // Load a random image from the images directory
        const imageIndex = Math.floor(Math.random() * 5) + 1; // Assuming 5 images named 1.png, 2.png, etc.
        this.image = new Image();
        this.image.src = `images/image_${imageIndex}.png`;
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}

class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = new Image();
        this.image.src = 'images/whale.png'; // Use the whale image
    }

    move(direction) {
        this.x += direction * 10; // Move 10 pixels left or right
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.size)); // Keep player within bounds
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size); // Draw the whale image
    }

    shrink() {
        this.size = Math.max(this.size - 1, 10); // Shrink to half the original size
    }

    grow() {
        this.size = Math.min(this.size + 1, 100); // Slowly grow back to the original size
    }

}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 600;
canvas.height = 550;
canvas.style.border = '1px solid black';
canvas.style.display = 'block';
canvas.style.margin = '0 auto';

// Add instructions below the canvas
const instructions = document.createElement('div');
instructions.textContent = 'Use the left and right arrow keys to move. Hold the down arrow key to shrink.';
instructions.style.textAlign = 'center';
instructions.style.marginTop = '10px';
document.body.appendChild(instructions);

const player = new Player(canvas.width / 2 - 25, canvas.height - 100, 50);
const fallingObjects = [];
let score = 0;

function spawnFallingObject() {
    const size = Math.random() * 50 + 30; // Random size between 20 and 50
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

    if (player.isShrinking) {
        player.shrink(); // Shrink the player when the down arrow is pressed
    } else {
        player.grow(); // Grow the player back when the down arrow is released
    }

    if (canvas.width > 200 && canvas.height > 200) { // Set a minimum size for the canvas
        if (Math.random() < 0.2) {
            canvas.height -= 0.5; // Reduce the height with a 20% chance
        }
        player.y = Math.min(player.y, canvas.height - player.size); // Ensure player stays within bounds
    }
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
    } else if (event.key === 'ArrowDown') {
        player.isShrinking = true; // Start shrinking
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowDown') {
        player.isShrinking = false; // Stop shrinking
    }
});

gameLoop();