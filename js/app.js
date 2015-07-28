// Some helper variables used for player movement on the screen
var tileSizeX = 101;
var tileSizeY = 83;
var offSetY = 27;
var playerMoveX = 2;
var playerMoveY = 5;

// Helper function to give a NEW random number each time it is called
var newNumber = function() {
    return Math.random();
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Sets the initial position of an enemy off screen at varying distances
    this.x = ((Math.floor(newNumber() * 5) + 1) * tileSizeY) * -1;
    this.y = (Math.floor(newNumber() * 3) + 1) * tileSizeY - offSetY;

    // Sets varying speeds for the enemies to travel at
    this.speed = (newNumber() * 25) + 15;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt * 10;

    // If the enemy travels off the screen, they are reset a new position off
    // of the screen and given a new speed. This recycles enemies and provides
    // variance for speeds.
    if (this.x > canvas.width + 10) {
        this.x = ((Math.floor(newNumber() * 5) + 1) * tileSizeY) * -1;
        this.y = (Math.floor(newNumber() * 3) + 1) * tileSizeY - offSetY;
        this.speed = (newNumber() * 25) + 15;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.checkForCollision = function() {
    // Helper variables are used to calculate the bounds of the enemy and player
    // given the center point of the characters and an offset of a bounding box.
    var enemyDifference = 30;
    var lowEnemy = this.x - enemyDifference;
    var highEnemy = this.x + enemyDifference;
    var playerDifference = 30;
    var lowPlayer = player.x - playerDifference;
    var highPlayer = player.x + playerDifference;

    // Calculates if the enemy and player are on the same row or not
    if (this.y === player.y) {
        // If so, checks if the enemy and player occupy the same space or not
        if (lowPlayer < highEnemy && highPlayer > lowEnemy) {
            // If so, they are colliding and the player needds to be reset
            resetPlayer();
        }
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    // Player receives a sprite and position, like the enemy
    // Position defaults to the center tile at the bottom of the screen
    this.sprite = 'images/char-boy.png';
    this.x = tileSizeX * playerMoveX;
    this.y = (tileSizeY * playerMoveY) - offSetY;

    // Initializes the player's score
    this.score = 0;
};

// Function determines what to do for each given key input
// and prevents the player from moving off of the screen
Player.prototype.handleInput = function(direction) {

    if(direction === 'left') {
        // Left arrow or a-key pressed
        if (playerMoveX !== 0) {
            playerMoveX--;
        }
    }
    else if (direction === 'up') {
        // Up arrow or w-key pressed
        if (playerMoveY !== 0) {
            playerMoveY--;
        }
    }
    else if(direction === 'right') {
        // Right arrow or d-key pressed
        if (playerMoveX !== 4) {
            playerMoveX++;
        }
    }
    else if(direction === 'down') {
        // Down arrow or s-key pressed
        if (playerMoveY !== 5) {
            playerMoveY++;
        }
    }
};

// Updates player movement
Player.prototype.update = function() {
    // Checks if the player has reached the water and needs
    // to be reset
    if (playerMoveY === 0) {
        this.score++;
        resetPlayer();
    }

    // Updates the score in case the player reached the water
    this.updateScore(this.score);

    // Updates position on the map of the player based on
    // the key input from above
    this.x = tileSizeX * playerMoveX;
    this.y = (tileSizeY * playerMoveY) - offSetY;
};

// Render's the player image
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Draws the score text above the map on the screen
Player.prototype.updateScore = function(playerScore) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "16pt Impact";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + playerScore.toString(), canvas.width/2, 30);
};

// Helper function to set the player back in the initial grass square
var resetPlayer = function() {
    playerMoveX = 2;
    playerMoveY = 5;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}

// Instantiate player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
