const startButton = document.getElementById("start-button");
const instructions = document.getElementById("instructions-text");
const mainPlayArea = document.getElementById("main-play-area");
const shooter = document.getElementById("player-controlled-shooter");
const monsterImgs = [
  "images/monster-1.png",
  "images/monster-2.png",
  "images/monster-3.png",
];
const scoreCounter = document.querySelector("#score span");

let justice;
let monsterInterval;
let starInterval;

startButton.addEventListener("click", (event) => {
  playGame();
});

function letShipFly(event) {
    event.preventDefault();
  
    switch (event.key) {
      case "w":
        moveVertical("up", 50);
        break;
      case "s":
        moveVertical("down", 50);
        break;
      case " ":
        fireLaser();
        break;
      default:
        // Handle other key events if needed
        break;
    }
  }
  
function moveVertical(direction,speed) {
    let topPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue("top"));
  
    if ((direction === "up" && topPosition > 0) || (direction === "down" && topPosition < 440)) {

      const offset = direction === "up" ? -speed : speed;
      shooter.style.transition = "top 0.1s ease"; 
      shooter.style.top = `${topPosition + offset}px`;
  
      // Clear the transition after it completes to avoid interference with manual position changes
      setTimeout(() => {
        shooter.style.transition = "";
      }, 100);
    }
  }
  

function fireLaser() {
  let laser = createLaserElement();
  mainPlayArea.appendChild(laser);
  let laserSFX = new Audio("audio/laser-sfx.m4a");
  laserSFX.play();
  moveLaser(laser);
}

function createLaserElement() {
  let xPosition = parseInt(
    window.getComputedStyle(shooter).getPropertyValue("left")
  );
  let yPosition = parseInt(
    window.getComputedStyle(shooter).getPropertyValue("top")
  );
  let newLaser = document.createElement("img");
  newLaser.src = "images/laser.png";
  newLaser.classList.add("laser");
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition - 10}px`;
  return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
      let xPosition = parseInt(laser.style.left);
  
      let monsters = document.querySelectorAll(".monster");

      monsters.forEach((monster) => {
        if (checkLaserCollision(laser, monster)) {
          handleLaserCollision(monster, laser);
        }
      });
  
      if (xPosition >= 550) {
        laser.remove();
      } else {
        laser.style.left = `${xPosition + 4}px`;
      }
    }, 10);
  }
  
  function handleLaserCollision(monster, laser) {
    let explosion = new Audio("audio/explosion.m4a");
    explosion.play();
    monster.src = "images/explosion.png";
    monster.classList.remove("monster");
    monster.classList.add("dead-monster");
    laser.remove();
    scoreCounter.innerText = parseInt(scoreCounter.innerText) + 100;
  }
  
function createMonster() {
  let newMonster = document.createElement("img");
  let monsterSpriteImg =
    monsterImgs[Math.floor(Math.random() * monsterImgs.length)];
  newMonster.src = monsterSpriteImg;
  newMonster.classList.add("monster");
  newMonster.classList.add("monster-transition");
  newMonster.style.left = "670px";
  newMonster.style.top = `${Math.floor(Math.random() * 460) + 30}px`;
  mainPlayArea.appendChild(newMonster);
  moveMonster(newMonster);
}


function moveMonster(monster) {
    function animate() {
      const xPosition = parseInt(monster.style.left) || 0;
  
      if (xPosition <= 50) {
        if (monster.classList.contains("dead-monster")) {
          monster.remove();
        } else {
          gameOver();
        }
      } else {
        monster.style.left = `${xPosition - 4}px`;
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }
  

function checkLaserCollision(laser, monster) {
    const laserRect = laser.getBoundingClientRect();
    const monsterRect = monster.getBoundingClientRect();
  
    return (
      laserRect.left < monsterRect.right &&
      laserRect.right > monsterRect.left &&
      laserRect.top < monsterRect.bottom &&
      laserRect.bottom > monsterRect.top
    );
  }
//   this version uses the getBoundingClientRect method to obtain the bounding boxes of both the laser and the monster. The condition checks if the two bounding boxes intersect, indicating a collision, more accurate collision detection.  

function createStar() {
    let star = document.createElement("div");
    star.classList.add("star");
  
    // Set random opacity and size
    star.style.opacity = Math.random();
    let size = Math.random() * 5 + 2; // Random size
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
  
    let leftPosition = Math.random() * 700;
    let topPosition = Math.random() * 500;
    star.style.left = `${leftPosition}px`;
    star.style.top = `${topPosition}px`;
    mainPlayArea.appendChild(star);
  }
  
  function moveStars() {
    let stars = document.querySelectorAll(".star");
    stars.forEach((star) => {
      let leftPosition = parseInt(window.getComputedStyle(star).getPropertyValue("left"));
  
      if (leftPosition <= -2) {
        star.remove();
        createStar();
      } else {
        star.style.left = `${leftPosition - 2}px`;
      }
    });
  }

function gameOver() {
    window.removeEventListener("keydown", letShipFly);
    justice.pause();
  
    // Play game over sound
    new Audio("audio/game-over.m4a").play();
  
    clearInterval(monsterInterval);
    clearInterval(starInterval);
  
    // Remove all monsters and lasers
    document.querySelectorAll(".monster, .laser").forEach((element) => element.remove());
  
    setTimeout(() => {
      alert(`Game Over! The monsters made it to Earth. Your final score is ${scoreCounter.innerText}!`);
  
      // Reset shooter position and display
      shooter.style.top = "250px";
      startButton.style.display = "block";
      instructions.style.display = "block";
      scoreCounter.innerText = 0;
    }, 1000);
  }
  
function playGame() {

  startButton.style.display = "none";
  instructions.style.display = "none";
  window.addEventListener("keydown", letShipFly);
  justice = new Audio("audio/cyberpunk.mp3");
  justice.play();

  monsterInterval = setInterval(createMonster, 2000);
  starInterval = setInterval(moveStars, 50);

  // Initial stars
for (let i = 0; i < 20; i++) {
    createStar();
  }
}