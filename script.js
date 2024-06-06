let morcego, game, scoreDisplay, initialScreen, deathScreen, finalScore, recordDisplay, initialScreenRecord;
let backgroundMusic, jumpMusic, endMusic;
let morcegoY, gameInterval, pipeInterval, score, backgroundPositionY, gameOver, gameStarted, record;
const gravity = 0.3;
const lift = -8;
let velocity = 0;

document.addEventListener('DOMContentLoaded', () => {
    morcego = document.getElementById('morcego');
    game = document.getElementById('game');
    scoreDisplay = document.getElementById('score');
    initialScreen = document.getElementById('initial-screen');
    deathScreen = document.getElementById('death-screen');
    finalScore = document.getElementById('final-score');
    recordDisplay = document.getElementById('record');
    initialScreenRecord = document.getElementById('initial-record');

    backgroundMusic = document.getElementById('background-music');
    jumpMusic = document.getElementById('jump-music');
    endMusic = document.getElementById('end-music');

    backgroundMusic.volume = 0.5;

    morcegoY = window.innerHeight * 0.6; // Ajuste para mover o morcego mais próximo da câmera
    gameInterval;
    pipeInterval;
    score = 0;
    backgroundPositionY = 0;
    gameOver = false;
    gameStarted = false;

    record = localStorage.getItem('record') || 0;
    recordDisplay.textContent = "Recorde: " + record;
    initialScreenRecord.textContent = "Recorde: " + record;

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (!gameStarted) {
                initialScreen.style.display = 'none';
                gameStarted = true;
                startGame();
            } else if (deathScreen.style.display === 'flex') {
                window.location.reload();
            } else {
                fly();
            }
        }
    });

    document.addEventListener('touchstart', (e) => {
        if (!gameStarted) {
            initialScreen.style.display = 'none';
            gameStarted = true;
            startGame();
        } else if (deathScreen.style.display === 'flex') {
            window.location.reload();
        } else {
            fly();
        }
    });
});

function startGame() {
    gameInterval = setInterval(gameLoop, 20);
    pipeInterval = setInterval(createPipe, 2500);
    backgroundMusic.play();
}

function gameLoop() {
    if (gameOver) return;

    velocity += gravity;
    morcegoY += velocity;
    morcego.style.top = morcegoY + 'px';

    if (morcegoY > window.innerHeight || morcegoY < 0) endGame();

    let hitboxBuffer = 10;
    let pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => {
        let pipeRect = pipe.getBoundingClientRect();
        let morcegoRect = morcego.getBoundingClientRect();
        let buffer = 5;
        if (
            morcegoRect.bottom - buffer - hitboxBuffer > pipeRect.top &&
            morcegoRect.top + buffer + hitboxBuffer < pipeRect.bottom &&
            ((morcegoRect.right - buffer - hitboxBuffer > pipeRect.left && pipe.classList.contains('left')) ||
            (morcegoRect.left + buffer + hitboxBuffer < pipeRect.right && pipe.classList.contains('right')))
        ) {
            endGame();
        }

        if (!pipe.passed && morcegoRect.bottom - buffer > pipeRect.bottom) {
            pipe.passed = true;
            if (pipe.classList.contains('left')) {
                score++;
                scoreDisplay.textContent = score;
                scoreDisplay.classList.remove('deflate');
                scoreDisplay.classList.add('deflate');
            }
        }

        if (pipeRect.bottom < 0) {
            pipe.remove();
        }
    });

    scoreDisplay.onanimationend = () => {
        scoreDisplay.classList.remove('deflate');
    };

    backgroundPositionY -= 2;
    game.style.backgroundPositionY = backgroundPositionY + 'px';
}

function createPipe() {
    let pipeWidth = Math.floor(Math.random() * (window.innerWidth / 2)) + 50;
    const gap = 200;

    let leftPipe = document.createElement('div');
    leftPipe.classList.add('pipe', 'left');
    leftPipe.style.width = pipeWidth + 'px';
    leftPipe.style.top = '100%';
    leftPipe.passed = false;
    game.appendChild(leftPipe);

    let rightPipe = document.createElement('div');
    rightPipe.classList.add('pipe', 'right');
    rightPipe.style.width = (window.innerWidth - pipeWidth - gap) + 'px';
    rightPipe.style.top = '100%';
    rightPipe.passed = false;
    game.appendChild(rightPipe);

    setTimeout(() => {
        if (!gameOver) {
            leftPipe.remove();
            rightPipe.remove();
        }
    }, 4000);
}

function fly() {
    if (gameOver) return;
    velocity = lift;
    jumpMusic.play();
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    clearInterval(pipeInterval);
    if (score > record) {
        record = score;
        localStorage.setItem('record', record);
        recordDisplay.textContent = "Recorde: " + record;
        initialScreenRecord.textContent = "Recorde: " + record;
    }
    finalScore.textContent = score;
    deathScreen.style.display = 'flex';
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    endMusic.play();
    let pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => {
        pipe.classList.add('paused');
    });
}