// There will only be one instance of this class. This instance will contain the
// data and methods related to the burger that moves at the bottom of your screen
class Player {
  // The constructor takes one parameter. This parameter refers to the parent DOM node.
  // We will be adding a DOM element to this parent DOM node.
  constructor(root) {
    // The x position starts off in the middle of the screen. Since this data is needed every time we move the player, we
    // store the data in a property of the instance. It represents the distance from the left margin of the browsing area to
    // the leftmost x position of the image.
    this.x = 3 * PLAYER_WIDTH;
    this.y = GAME_HEIGHT - PLAYER_HEIGHT;

    // We create a DOM node. We will be updating the DOM node every time we move the player, so we store a reference to the
    // DOM node in a property.
    this.domElement = document.createElement("div");
    this.domElement.className = "player";
    this.domElement.id = "player";
    this.domElement.style.left = `${this.x}px`;
    this.domElement.style.top = `${this.y + 2 * ENEMY_HEIGHT}px`;
    this.domElement.style.visibility = "hidden";
    this.domElement.style.width = PLAYER_WIDTH;
    this.domElement.style.height = PLAYER_HEIGHT;
    this.domElement.innerHTML = '<img src="images/ship.gif" width = "54px">';
    root.appendChild(this.domElement);

    this.time = new Date();
    this.playerLives = PLAYER_LIVES;
  }

  // This method will be called when the user presses the left key. See in Engine.js
  // how we relate the key presses to this method
  moveLeft() {
    if (this.x > 0) {
      this.x -= PLAYER_WIDTH;
    }
    this.domElement.style.left = `${this.x}px`;
  }

  // We do the same thing for the right key. See Engine.js to see when this happens.
  moveRight() {
    if (this.x + PLAYER_WIDTH < GAME_WIDTH) {
      this.x += PLAYER_WIDTH;
    }
    this.domElement.style.left = `${this.x}px`;
  }

  moveUp() {
    if (this.y > PLAYER_HEIGHT) {
      this.y -= PLAYER_HEIGHT;
    }
    this.domElement.style.top = `${this.y}px`;
    // const posYrect = this.domElement.getBoundingClientRect();
    // if (posYrect.top > PLAYER_HEIGHT) {
    //   this.domElement.style.top = posYrect.top - PLAYER_HEIGHT;
    // }
  }

  moveDown() {
    if (this.y < GAME_HEIGHT - PLAYER_HEIGHT - 10) {
      this.y = this.y + PLAYER_HEIGHT;
    }
    this.domElement.style.top = `${this.y}px`;
    // const posYrect = this.domElement.getBoundingClientRect();
    // if (posYrect.top < GAME_HEIGHT - this.y) {
    //   this.domElement.style.top = posYrect.top + PLAYER_HEIGHT;
    // }
  }

  explosionFunc() {
    this.playerLives -= 1;
    this.domElement.innerHTML = `<img src="images/explosion.gif?a='${Math.random()}'" width = "54px">`;
    const delayAppearance = () => {
      this.domElement.style.visibility = "hidden";
      this.domElement.style.top = `${this.y + 2 * ENEMY_HEIGHT}px`;
    };
    setTimeout(delayAppearance, 1300);
  }

  reBirthFunc() {
    if (this.playerLives > 0) {
      this.domElement.innerHTML = '<img src="images/ship.gif" width = "54px">';
      this.domElement.style.top = `${this.y}px`;
      this.domElement.style.visibility = "visible";
    } else {
      this.domElement.innerHTML = "";
    }
  }
}
