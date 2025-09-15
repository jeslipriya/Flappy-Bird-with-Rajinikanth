// Game variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScore = document.getElementById('final-score');
const finalLevel = document.getElementById('final-level');
const levelUpText = document.getElementById('level-up-text');
const pipeInfo = document.getElementById('pipe-info');

// Set canvas dimensions
canvas.width = 360;
canvas.height = 640;

// Game state
let game = {
    isRunning: false,
    score: 0,
    level: 1,
    gravity: 0.5,
    speed: 3,
    pipeGap: 200,
    minPipeInterval: 1800,  // Increased minimum interval
    maxPipeInterval: 2800,  // Added maximum interval
    nextPipeTime: 0,
    timeSinceLastPipe: 0
};

// Bird object
let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 34,
    height: 24,
    velocity: 0,
    jumpStrength: -10,
    
    draw: function() {
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bird's eye
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y - 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bird's beak
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y);
        ctx.lineTo(this.x + 25, this.y);
        ctx.lineTo(this.x + 12, this.y + 8);
        ctx.fill();
        
        // Draw wing
        ctx.fillStyle = '#ffc107';
        ctx.beginPath();
        ctx.ellipse(this.x - 5, this.y + 5, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();
    },
    
    jump: function() {
        this.velocity = this.jumpStrength;
    },
    
    update: function() {
        this.velocity += game.gravity;
        this.y += this.velocity;
        
        // Floor collision
        if (this.y + this.height/2 > canvas.height - 80) {
            this.y = canvas.height - 80 - this.height/2;
            gameOver();
        }
        
        // Ceiling collision
        if (this.y - this.height/2 < 0) {
            this.y = this.height/2;
            this.velocity = 0;
        }
    },
    
    reset: function() {
        this.y = canvas.height / 2;
        this.velocity = 0;
    }
};

// Pipes array
let pipes = [];

// Pipe constructor
function Pipe() {
    this.width = 60;
    this.x = canvas.width;
    this.topHeight = Math.floor(Math.random() * (canvas.height - game.pipeGap - 150)) + 50;
    this.bottomY = this.topHeight + game.pipeGap;
    
    this.draw = function() {
        // Top pipe
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        
        // Bottom pipe
        ctx.fillRect(this.x, this.bottomY, this.width, canvas.height - this.bottomY);
        
        // Pipe caps
        ctx.fillStyle = '#388e3c';
        ctx.fillRect(this.x - 5, this.topHeight - 20, this.width + 10, 20);
        ctx.fillRect(this.x - 5, this.bottomY, this.width + 10, 20);
    };
    
    this.update = function() {
        this.x -= game.speed;
        
        // Check if bird passed the pipe
        if (this.x + this.width < bird.x && !this.passed) {
            game.score++;
            scoreDisplay.textContent = game.score;
            
            // Check for level up
            if (game.score % 10 === 0) {
                levelUp();
            }
            
            this.passed = true;
        }
        
        // Check for collision
        if (
            bird.x + bird.width/2 > this.x && 
            bird.x - bird.width/2 < this.x + this.width &&
            (bird.y - bird.height/2 < this.topHeight || 
                bird.y + bird.height/2 > this.bottomY)
        ) {
            gameOver();
        }
    };
}

// Draw background
function drawBackground() {
    // Sky
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clouds
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(80, 80, 30, 0, Math.PI * 2);
    ctx.arc(110, 70, 35, 0, Math.PI * 2);
    ctx.arc(140, 85, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(280, 120, 40, 0, Math.PI * 2);
    ctx.arc(250, 110, 30, 0, Math.PI * 2);
    ctx.arc(220, 125, 35, 0, Math.PI * 2);
    ctx.fill();
    
    // Ground
    ctx.fillStyle = '#d7ccc8';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
    
    // Grass
    ctx.fillStyle = '#8bc34a';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 10);
    
    // Grass details
    ctx.fillStyle = '#7cb342';
    for (let i = 0; i < canvas.width; i += 15) {
        ctx.fillRect(i, canvas.height - 80, 5, 15);
    }
}

// Calculate random pipe interval based on level
function getRandomPipeInterval() {
    // Higher levels have slightly less variation
    const variation = Math.max(300, 800 - game.level * 30);
    const baseInterval = game.minPipeInterval + (game.level - 1) * 50;
    
    return Math.random() * variation + baseInterval;
}

// Game functions
function startGame() {
    game.isRunning = true;
    game.score = 0;
    game.level = 1;
    game.gravity = 0.5;
    game.speed = 3;
    game.pipeGap = 200;
    game.minPipeInterval = 1800;
    game.maxPipeInterval = 2800;
    game.nextPipeTime = getRandomPipeInterval();
    game.timeSinceLastPipe = 0;
    
    scoreDisplay.textContent = '0';
    levelDisplay.textContent = 'Level: 1';
    
    bird.reset();
    pipes = [];
    
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    
    // Start game loop
    lastTime = Date.now();
    gameLoop();
}

function gameOver() {
    game.isRunning = false;
    
    // Play hit sound (simulated)
    playHitSound();
    
    finalScore.textContent = game.score;
    finalLevel.textContent = game.level;
    gameOverScreen.style.display = 'flex';
}

function levelUp() {
    game.level++;
    levelDisplay.textContent = `Level: ${game.level}`;
    
    // Increase difficulty
    game.speed += 0.5;
    game.pipeGap = Math.max(120, game.pipeGap - 8);
    
    // Show level up text
    levelUpText.style.opacity = '1';
    setTimeout(() => {
        levelUpText.style.opacity = '0';
    }, 2000);
    
    // Play level up sound (simulated)
    playLevelUpSound();
}

// Audio functions (simulated since we can't access local files directly in this environment)
function playLevelUpSound() {
    const levelUpSound = new Audio('audio/Valthukal-Valthukal.mp3');
    levelUpSound.play();
    
    // Simulate sound with console log
    console.log("Playing level up sound!");
}

function playHitSound() {
    const hitSound = new Audio('audio/Oh-my-God.mp3');
    hitSound.play();
    
    // Simulate sound with console log
    console.log("Playing hit sound!");
}

// Game loop variables
let lastTime = Date.now();

// Game loop
function gameLoop() {
    if (!game.isRunning) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    bird.update();
    bird.draw();
    
    // Update pipe generation timing
    game.timeSinceLastPipe += deltaTime;
    
    // Generate new pipe if it's time
    if (game.timeSinceLastPipe >= game.nextPipeTime) {
        pipes.push(new Pipe());
        game.timeSinceLastPipe = 0;
        game.nextPipeTime = getRandomPipeInterval();
    }
    
    // Update pipe info display
    pipeInfo.textContent = `Next pipe in: ${Math.max(0, Math.floor((game.nextPipeTime - game.timeSinceLastPipe) / 100)) / 10}s`;
    
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].update();
        pipes[i].draw();
        
        // Remove pipes that are off screen
        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
            i--;
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

canvas.addEventListener('click', function() {
    if (game.isRunning) {
        bird.jump();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && game.isRunning) {
        bird.jump();
        e.preventDefault();
    }
    
    // Start game with spacebar if not running
    if (e.code === 'Space' && !game.isRunning && startScreen.style.display !== 'none') {
        startGame();
        e.preventDefault();
    }
});

// Initialize canvas
drawBackground();
bird.draw();