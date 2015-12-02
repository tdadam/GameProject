/**
 * Created by tdadam on 11/11/15.
 */

var
    canvas,
    renderingContext,
    width,
    height,

    foregroundPosition = 0,
    frames = 0, //Counts number of frames rendered
    score = 0,
    best = localStorage.getItem('best'),
    //using localStorage to retain the best score
    shipGapMin = 110,
    shipGapMax = 160,
    shipGap = shipGapMax,

    mech, //playable character
    ships, //obstacles

    //state vars
    currentState,

    //splash, gameplay. score
    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    };

function Mech() {
    //sets x position and creates placeholders to reference (such as y position)
    this.x = 90;
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 1]; // The animation sequence

    this.rotation = 0;
    this.radius = 14;

    this.gravity = 0.25;
    this._jump = 4.6;

    //causes Mech to jump
    this.jump = function () {
        this.velocity = -this._jump;
    };

    //Update sprite animation and position of Mech
    this.update = function () {
        // Play animation twice as fast during game state
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdleMech();
        } else { // Game state
            this.updatePlayingMech();
        }
    };

    //Runs the mech through its idle animation.
    this.updateIdleMech = function () {
        this.y = height - 220 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    //Determines mech animation for the player-controlled mech.
    this.updatePlayingMech = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Change to the score state when mech touches the ground
        if (this.y >= height - foregroundSprite.height - 10) {
            this.y = height - foregroundSprite.height - 10;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }
        // Change to the score state when mech touches the top
        if (this.y <= 400 - (height)) {
            if (currentState === states.Game) {
                currentState = states.Score;
            }
            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }

        // When mech lacks upward momentum increment the rotation angle
        if (this.velocity >= this._jump) {
            this.frame = 0;
            this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
        } else { //sets minimal rotation during jump
            this.rotation = -0.1;
        }
    };

    //Draws Mech to canvas renderingContext
    //@param {CanvasRenderingContext2D} renderingContext the context used for drawing
    this.draw = function (renderingContext) {
        renderingContext.save();

        // translate and rotate renderingContext coordinate system
        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

        // draws the mech with center
        mechSprite[n].draw(renderingContext, -mechSprite[n].width / 2, -mechSprite[n].height / 2);

        renderingContext.restore();
    };
}

//obstacle render and update function
function ShipsCollection() {
    this._ships = [];
    this.add = function () {
        this._ships.push(new Ship());
    };
    //changes the gap by 10 px each obstacle, then resets to max once min is reached
    this.update = function () {
        if (frames % 100 === 0) {
            if (shipGap > shipGapMin) {
                shipGap = shipGap - 10;
            }
            if (shipGap <= shipGapMin) {
                shipGap = shipGapMax;
            }
            this.add();
        }
        for (var i = 0, len = this._ships.length; i < len; i++) {
            var ship = this._ships[i];
            if (i === 0) {
                ship.detectCollision(); //checks collision with left obstacle
            }
            //increment score as obstacle is passed, -10px since obstacle is wider at base
            score += (ship.x + topObstacleSprite.width - 10) === mech.x ? 1 : 0;

            ship.x -= 2;
            //remove obstacle as it leaves the canvas, garbage collection
            if (ship.x < -ship.width) {
                this._ships.splice(i, 1);
                i--;
                len--;
            }
        }
    };
    //adds obstacle to canvas
    this.draw = function () {
        for (var i = 0, len = this._ships.length; i < len; i++) {
            var ship = this._ships[i];
            ship.draw();
        }
    }
}

//obstacle creation to use within the ShipsCollection function
function Ship() {
    this.gap = shipGap; //allows gap to change
    this.x = 500;
    //random position of the gap
    this.y = height - (topObstacleSprite.height + foregroundSprite.height + 120 + 200 * Math.random());
    this.width = topObstacleSprite.width;
    this.height = topObstacleSprite.height;
    //check for collision, end game
    this.detectCollision = function () {
        var cx = Math.min(Math.max(mech.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(mech.y, this.y), this.y + this.height);
        var cy2 = Math.min(Math.max(mech.y, this.y + this.height + this.gap), this.y + 2 * this.height + this.gap);

        var dx = mech.x - cx;
        var dy1 = mech.y - cy1;
        var dy2 = mech.y - cy2;

        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = mech.radius * mech.radius;

        if (r > d1 || r > d2) {
            currentState = states.Score;
        }
    };
    //draw the actual sprite to canvas so the ShipsCollection draw will display
    this.draw = function () {
        topObstacleSprite.draw(renderingContext, this.x, this.y);
        bottomObstacleSprite.draw(renderingContext, this.x, this.y + this.gap + this.height);
    }
}
//click function
function onpress(evt) {
    switch (currentState) {
        case states.Splash: //start the game and update the mech velocity
            currentState = states.Game;
            mech.jump();
            break;
        case states.Game: //game in progress, update velocity
            mech.jump();
            break;
        case states.Score: //change from score to splash on button
            //getting event location
            var mouseX = evt.offsetX, mouseY = evt.offsetY;
            if (mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }
            //detect if mouse is within the text box and reset if in correct location
            if (115 < mouseX && mouseX < 278 && 190 < mouseY && mouseY < 235) {
                resetGame();
            }
            break;
    }
}
//remove obstacles, change to splash screen, reset score and shipGap to max
function resetGame() {
    ships._ships = [];
    currentState = states.Splash;
    score = 0;
    shipGap = shipGapMax;
}

//messy function, but leaving commented code in case there is time to add phone usability
function windowSetup() {
    //set up global variables for canvas to pull
    //retrieve width and height
    //width = window.innerWidth;
    //height = window.innerHeight;

    //Set width and height if on display with width < 500px (desktop vs tablet)
    //var inputEvent = "touchstart";
    //if (width >= 500) {
    //    width = 380;
    //    height = 370;
    //    inputEvent = "mousedown";
    //}

    width = 380;
    height = 370;
    var inputEvent = "mousedown";

    //create listener for input event
    document.addEventListener(inputEvent, onpress);
}

//uses windowSetup to create canvas portion
function canvasSetup() {
    canvas = document.createElement("canvas");
    canvas.style.border = "1px solid black";
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext("2d");
}

//pull images from sprite sheet
function loadGraphics() {
    var img = new Image();
    img.src = "./images/mySprites.png";
    img.onload = function () {
        initSprites(this);
        gameLoop();
    };
}

//setup on page load
function main() {
    windowSetup();
    canvasSetup();
    currentState = states.Splash;
    document.body.appendChild(canvas);
    mech = new Mech();
    ships = new ShipsCollection();
    loadGraphics();
}

//constant update when not on Splash or Score screen
function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}


//Updates all moving sprites: foreground, mech, and ships
function update() {
    frames++;

    if (currentState !== states.Score) {
        foregroundPosition = (foregroundPosition - 2) % 500; // Move left two px each frame. Wrap every 14px.
    }
    else {
        best = Math.max(best, score);
    }
    //only set obstacles during active game
    if (currentState === states.Game) {
        ships.update();
    }
    //updates mech during Splash or game states
    mech.update();
}

//Re-draw the game view.
function render() {
    // Draw background sprites
    backgroundSprite.draw(renderingContext, 0, height - backgroundSprite.height);
    backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);

    //add obstacles and player
    ships.draw(renderingContext);
    mech.draw(renderingContext);

    //draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);

    //check state and show correct screen
    if (currentState === states.Splash) {
        splashState();
    }
    else if (currentState === states.Score) {
        localStorage.setItem('best', best);
        scoreState();
    }
    else {
        gameScore();
    }
}

//sets the text and position on the Splash screen
function splashState() {
    renderingContext.strokeStyle = "white";
    renderingContext.font = "40px Comic Sans MS";
    renderingContext.strokeText("Flappy Mech", 135, 125);
    renderingContext.font = "18px Comic Sans MS";
    renderingContext.strokeText("Controls: Click to elevate", 135, 185);
    renderingContext.strokeText("Goal: Avoid all obstacles", 135, 210);
    renderingContext.font = "30px Comic Sans MS";
    renderingContext.strokeText("Click to Start!", 135, 275);
}

//sets the text and position on Score screen
function scoreState() {
    renderingContext.strokeStyle = "white";
    renderingContext.font = "40px Comic Sans MS";
    renderingContext.strokeText("Game Over", 90, 100);
    renderingContext.font = "18px Comic Sans MS";
    renderingContext.strokeText("Score: " + score, 155, 140);
    renderingContext.strokeText("Best: " + best, 160, 170);
    renderingContext.font = "30px Comic Sans MS";
    renderingContext.strokeRect(115, 190, 163, 45);
    renderingContext.strokeText("Try Again?", 120, 220);
}

//sets text and position of score that increments during game
function gameScore() {
    renderingContext.strokeStyle = "white";
    renderingContext.font = "25px Comic Sans MS";
    renderingContext.strokeText("" + score, 185, 50);
}