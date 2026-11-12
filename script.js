
// NIGHT DRIVE - GAME SYSTEM

const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");

const playerCar = document.getElementById("player-car");
const road = document.querySelector(".road");

const scoreDisplay = document.getElementById("score");
const coinsDisplay = document.getElementById("coins");
const livesDisplay = document.getElementById("lives");
const missionText = document.getElementById("mission-text");

const trafficContainer = document.getElementById("traffic-container");
const coinContainer = document.getElementById("coin-container");

let score = 0;
let coins = 0;
let lives = 3;
let carPosition = 1;
let selectedCar = "blue";
let running = false;

let traffic = [];
let coinItems = [];

let animationId;
let spawnTimer;
let scoreTimer;

const lanes = [0.2, 0.5, 0.8];

// CAR SELECTION

document.querySelectorAll(".car-button").forEach(button => {
    button.addEventListener("click", () => {
        selectedCar = button.dataset.car;

        document.getElementById("selected-car").textContent =
            "Selected: " + button.textContent;

        document.querySelectorAll(".car-button").forEach(btn => {
            btn.style.background = "transparent";
            btn.style.color = "#28eaff";
        });

        button.style.background = "#28eaff";
        button.style.color = "#080817";
    });
});

// START GAME

document.getElementById("start-button").addEventListener("click", startGame);

document.getElementById("restart-button").addEventListener("click", startGame);

function startGame() {

    score = 0;
    coins = 0;
    lives = 3;
    carPosition = 1;

    traffic = [];
    coinItems = [];

    trafficContainer.innerHTML = "";
    coinContainer.innerHTML = "";

    playerCar.className = "car " + selectedCar;
    playerCar.style.left = "calc(50% - 21px)";

    updateStats();

    menuScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    missionText.textContent = "Mission 1: Avoid traffic!";

    running = true;

    clearInterval(spawnTimer);
    clearInterval(scoreTimer);
    cancelAnimationFrame(animationId);

    spawnTimer = setInterval(spawnObjects, 1200);

    scoreTimer = setInterval(() => {
        if (!running) return;

        score += 1;
        updateMission();
        updateStats();
    }, 500);

    animationLoop();
}

// CAR MOVEMENT

function moveLeft() {
    if (!running) return;

    if (carPosition > 0) {
        carPosition--;
        updateCarPosition();
    }
}

function moveRight() {
    if (!running) return;

    if (carPosition < 2) {
        carPosition++;
        updateCarPosition();
    }
}

function updateCarPosition() {
    const positions = ["20%", "50%", "80%"];

    playerCar.style.left =
        `calc(${positions[carPosition]} - 21px)`;
}

document.getElementById("left-button").addEventListener("click", moveLeft);
document.getElementById("right-button").addEventListener("click", moveRight);

// KEYBOARD CONTROLS

document.addEventListener("keydown", event => {

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        moveLeft();
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        moveRight();
    }

});

// MOBILE CONTROLS

let touchLeft = false;
let touchRight = false;

document.getElementById("left-button").addEventListener("touchstart", event => {
    event.preventDefault();
    moveLeft();
});

document.getElementById("right-button").addEventListener("touchstart", event => {
    event.preventDefault();
    moveRight();
});

// SPAWN TRAFFIC AND COINS

function spawnObjects() {

    if (!running) return;

    const lane = Math.floor(Math.random() * 3);

    if (Math.random() < 0.65) {

        const car = document.createElement("div");

        car.className = "traffic-car";

        car.style.left = `calc(${lanes[lane] * 100}% - 21px)`;
        car.style.top = "-80px";

        trafficContainer.appendChild(car);

        traffic.push({
            element: car,
            lane: lane,
            y: -80
        });

    } else {

        const coin = document.createElement("div");

        coin.className = "coin";

        coin.style.left = `calc(${lanes[lane] * 100}% - 12px)`;
        coin.style.top = "-30px";

        coinContainer.appendChild(coin);

        coinItems.push({
            element: coin,
            lane: lane,
            y: -30
        });

    }
}

// GAME ANIMATION

function animationLoop() {

    if (!running) return;

    const playerRect = playerCar.getBoundingClientRect();

    traffic.forEach(car => {

        car.y += 5;

        car.element.style.top = car.y + "px";

        const carRect = car.element.getBoundingClientRect();

        if (
            playerRect.left < carRect.right - 5 &&
            playerRect.right > carRect.left + 5 &&
            playerRect.top < carRect.bottom - 5 &&
            playerRect.bottom > carRect.top + 5
        ) {

            loseLife(car);

        }

    });

    coinItems.forEach(coin => {

        coin.y += 5;

        coin.element.style.top = coin.y + "px";

        const coinRect = coin.element.getBoundingClientRect();

        if (
            playerRect.left < coinRect.right &&
            playerRect.right > coinRect.left &&
            playerRect.top < coinRect.bottom &&
            playerRect.bottom > coinRect.top
        ) {

            collectCoin(coin);

        }

    });

    traffic = traffic.filter(car => {
        if (car.y > road.clientHeight) {
            car.element.remove();
            return false;
        }

        return true;
    });

    coinItems = coinItems.filter(coin => {
        if (coin.y > road.clientHeight) {
            coin.element.remove();
            return false;
        }

        return true;
    });

    animationId = requestAnimationFrame(animationLoop);
}

// LOSE LIFE

function loseLife(car) {

    car.element.remove();

    traffic = traffic.filter(item => item !== car);

    lives--;

    updateStats();

    if (lives <= 0) {
        endGame();
    }
}

// COLLECT COINS

function collectCoin(coin) {

    coin.element.remove();

    coinItems = coinItems.filter(item => item !== coin);

    coins++;
    score += 50;

    updateStats();
    updateMission();
}

// SCORE AND MISSIONS

function updateStats() {

    scoreDisplay.textContent = score;
    coinsDisplay.textContent = coins;

    livesDisplay.textContent = "❤️".repeat(lives) +
        "🖤".repeat(3 - lives);

}

function updateMission() {

    if (coins >= 5) {
        missionText.textContent = "MISSION 2 COMPLETE! Collect 10 coins!";
    }

    if (score >= 100) {
        missionText.textContent = "MISSION 3: Survive and beat your record!";
    }

    if (score >= 200) {
        missionText.textContent = "ALL MISSIONS COMPLETE!";
    }

}

// GAME OVER

function endGame() {

    running = false;

    clearInterval(spawnTimer);
    clearInterval(scoreTimer);
    cancelAnimationFrame(animationId);

    gameScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");

    document.getElementById("final-score").textContent = score;

    // SAVE HIGH SCORE

    let highScore = Number(localStorage.getItem("nightDriveHighScore")) || 0;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("nightDriveHighScore", highScore);
    }

    document.getElementById("final-score").textContent =
        score + " | BEST: " + highScore;

}
