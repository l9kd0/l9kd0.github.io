// filepath: falling-objects-game/src/main.js

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = 480;
canvas.height = 320;

let player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 30,
    speed: 5
};

let fallingObjects = [];
let gameOver = false;

function createFallingObject() {
    const x = Math.random() * (canvas.width - 20);
    fallingObjects.push({ x: x, y: 0, width: 20, height: 20 });
}

function updateFallingObjects() {
    for (let i = 0; i < fallingObjects.length; i++) {
        fallingObjects[i].y += 2; // falling speed
        if (fallingObjects[i].y > canvas.height) {
            fallingObjects.splice(i, 1);
            i--;
        }
    }
}

function checkCollision() {
    for (let obj of fallingObjects) {
        if (obj.x < player.x + player.width &&
            obj.x + obj.width > player.x &&
            obj.y < player.y + player.height &&
            obj.y + obj.height > player.y) {
            gameOver = true;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw falling objects
    ctx.fillStyle = 'red';
    for (let obj of fallingObjects) {
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
}

function gameLoop() {
    if (!gameOver) {
        updateFallingObjects();
        checkCollision();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (event.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
});

setInterval(createFallingObject, 1000);
gameLoop();