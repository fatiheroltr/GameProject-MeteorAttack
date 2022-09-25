// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    // We add the background image to the game
    addBackground(this.root);

    this.enemyCounter = 0;

    this.statusBar = document.getElementById("status-bar");
    this.scoreText = document.getElementById("score");
    this.lives = document.getElementById("lives");
    this.gameOverText = document.getElementById("game-over");
    this.gameOverStartAgainText = document.getElementById(
      "game-over-start-again"
    );
    this.welcome = document.getElementById("welcome");
    this.startBtn = document.getElementById("start-btn");
    this.instructions = document.getElementById("instructions");

    this.playerIsDead = false;
    this.isPlayerCurrentlyEploding = false;
  }

  startButtonAction = () => {
    this.welcome.style.top = `-${PLAYER_WIDTH}`;
    this.welcome.style.opacity = "40%";
    this.welcome.style.transform = "scale(.3)";
    this.startBtn.style.display = "none";
    this.lives.style.display = "block";
    this.instructions.style.display = "none";
    document.getElementById("player").style.visibility = "visible";
    document.getElementById("player").style.top = `${
      GAME_HEIGHT - PLAYER_HEIGHT
    }`;
  };

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array

  gameLoop = () => {
    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });
    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });
    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
      this.enemyCounter += 1;
      this.scoreText.innerHTML = `SCORE: ${this.enemyCounter * 5 - 15}`;
    }

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    if (this.isPlayerDead()) {
      this.welcome.style.top = `-10px`;
      this.welcome.style.opacity = "100%";
      this.welcome.style.transform = "scale(.5)";
      this.gameOverText.style.display = "block";
      this.gameOverStartAgainText.style.display = "block";
      return;
    }
    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.
  isPlayerDead = () => {
    if (this.player.playerLives === 0) {
      this.player.explosionFunc();
      this.playerIsDead = true;
    } else {
      this.enemies.forEach((enemy) => {
        if (
          this.player.x === enemy.x &&
          enemy.y > this.player.y - 2 * ENEMY_HEIGHT &&
          // To increase to playability and dodge the meteors more easily,
          // I made it, only meteor itself can kill you not the flames behind it
          enemy.y <= this.player.y - 2 * ENEMY_HEIGHT + 45
        ) {
          if (this.isPlayerCurrentlyEploding === false) {
            this.isPlayerCurrentlyEploding = true;
            this.player.explosionFunc();
            // this.livesText.innerHTML = `LIVES: ${this.player.playerLives}`;
            if (this.player.playerLives === 2) {
              this.lives.innerHTML = `<img src="./images/live-empty.png" alt="" class="live-icon"><img src="./images/live.png" alt="" class="live-icon"><img
            src="./images/live.png" alt="" class="live-icon">`;
            } else if (this.player.playerLives === 1) {
              this.lives.innerHTML = `<img src="./images/live-empty.png" alt="" class="live-icon"><img src="./images/live-empty.png" alt="" class="live-icon"><img
            src="./images/live.png" alt="" class="live-icon">`;
            } else if (this.player.playerLives === 0) {
              this.lives.innerHTML = `<img src="./images/live-empty.png" alt="" class="live-icon"><img src="./images/live-empty.png" alt="" class="live-icon"><img
            src="./images/live-empty.png" alt="" class="live-icon">`;
            }
          }
          const delayReBirth = () => {
            this.player.reBirthFunc();
            this.isPlayerCurrentlyEploding = false;
          };
          setTimeout(delayReBirth, 1500);
        }
      });
    }

    return this.playerIsDead;
  };
}
