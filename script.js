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

    morcegoY = window.innerHeight / 2;
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