/**
 * Created by tdadam on 11/11/15.
 */
//NEW:
//1. WindowSetup call with main, add to global and add game state
//2. Width and height pull from the global var (in canvasSetup)
//3. Load Graphics is updated, pulling info into GameSprite.js
//4. GameLoop function, update function, render function
//5. massive bird sprite function
//6. Add onpress function since referenced
//At this point, matches original without ship
//all calls and references to obstacles commented out, concentrating on animate sprite and begin game state so sprite jumps
//Sprite drawn in update junction that refreshes constantly, to scroll animation
//http://uxcobra.com/js/fishGame.html


var
    canvas,
    renderingContext,
    width,
    height,

    foregroundPosition = 0,
    frames = 0, //Counts number of frames rendered
    score = 0,
    best = 0,
    shipGapMin = 120,
    shipGapMax = 145,
    shipGap = shipGapMax,

    mech, //playable character
    ships,

//state vars
    currentState,

//splash, gameplay. score
    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    };


function Mech() {
    this.x = 90;
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 1]; // The animation sequence

    this.rotation = 0;
    this.radius = 14;

    this.gravity = 0.25;
    this._jump = 4.6;

    /**
     * Makes the Mech jump
     */
    this.jump = function () {
        this.velocity = -this._jump;
    };

    /**
     * Update sprite animation and position of Mech
     */
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

    /**
     * Runs the mech through its idle animation.
     */
    this.updateIdleMech = function () {
        this.y = height - 220 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    /**
     * Determines mech animation for the player-controlled mech.
     */
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
            //this.y = height - foregroundSprite.height - 10;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }

// When mech lacks upward momentum increment the rotation angle
        if (this.velocity >= this._jump) {
            this.frame = 0;
            this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
        } else {
            this.rotation = -0.1;
        }
    };

    /**
     * Draws Mech to canvas renderingContext
     * @param {CanvasRenderingContext2D} renderingContext the context used for drawing
     */
    this.draw = function (renderingContext) {
        renderingContext.save();

// translate and rotate renderingContext coordinate system
        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

// draws the mech with center in origo
        mechSprite[n].draw(renderingContext, -mechSprite[n].width / 2, -mechSprite[n].height / 2);

        renderingContext.restore();
    };
}

ships = {
    _ships: [],
    reset: function () {
        this._ships = [];
        shipGap = shipGapMax;
    },
    update: function () {
        if (frames % 100 === 0) {
            var _y = height - (topObstacleSprite.height + foregroundSprite.height + 120 + 200 * Math.random());
            if (shipGap > shipGapMin) {
                shipGap = shipGap - 5;
            }
            this._ships.push({
                gap: shipGap,
                x: 500,
                y: _y,
                width: topObstacleSprite.width,
                height: topObstacleSprite.height
            });
        }
        for (var i = 0, len = this._ships.length; i < len; i++) {
            var p = this._ships[i];
//if (i === 0) {
            score += (p.x + topObstacleSprite.width) === mech.x ? 1 : 0;


            var cx = Math.min(Math.max(mech.x, p.x), p.x + p.width);
            var cy1 = Math.min(Math.max(mech.y, p.y), p.y + p.height);
            var cy2 = Math.min(Math.max(mech.y, p.y + p.height + p.gap), p.y + 2 * p.height + p.gap);

            var dx = mech.x - cx;
            var dy1 = mech.y - cy1;
            var dy2 = mech.y - cy2;

            var d1 = dx * dx + dy1 * dy1;
            var d2 = dx * dx + dy2 * dy2;
            var r = mech.radius * mech.radius;

            if (r > d1 || r > d2) {
                currentState = states.Score;
            }
            p.x -= 2;
            if (p.x < -p.width) {
                this._ships.splice(i, 1);
                i--;
                len--;
            }
        }
    },
    draw: function(renderingContext) {
        for (var i = 0, len = this._ships.length; i < len; i++) {
            var p = this._ships[i];
            topObstacleSprite.draw(renderingContext, p.x, p.y);
            bottomObstacleSprite.draw(renderingContext, p.x, p.y+ p.gap+ p.height);
        }
    }
};

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
            //check hitting the button
            if (okButton.x < mouseX && mouseX < okButton.width && okButton.y < mouseY && mouseY < okButton.height) {
                ships.reset();
                currentState = states.Splash;
                score = 0;
            }
            break;
    }

}

function windowSetup() {
    //set up global variables for canvas to pull
    //retrieve width and height
    width = window.innerWidth;
    height = window.innerHeight;

    //Set width and height if on display with width < 500px (desktop vs tablet)
    var inputEvent = "touchstart";
    if (width >= 500) {
        width = 380;
        height = 370;
        inputEvent = "mousedown";
    }

    //create listener for input event
    document.addEventListener(inputEvent, onpress);
}

function canvasSetup() {
    canvas = document.createElement("canvas");
    canvas.style.border = "1px solid black";
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext("2d");
}

function loadGraphics() {
    var img = new Image();
    img.src = "./images/mySprites.png";
    img.onload = function () {
        initSprites(this);
        //renderingContext.fillStyle = backgroundSprite.color;


        okButton = {
            x: (width - okButtonSprite.width) / 2,
            y: height - 200,
            width: okButtonSprite.width,
            height: okButtonSprite.height
        };
        gameLoop();
    };

}

function main() {
    windowSetup();
    canvasSetup();
    currentState = states.Splash;
    document.body.appendChild(canvas);
    mech = new Mech();
    //ships = new ShipCollection();
    loadGraphics();
}

function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

/**
 * Updates all moving sprites: foreground, fish, and ships
 */
function update() {
    frames++;

    if (currentState !== states.Score) {
        foregroundPosition = (foregroundPosition - 2) % 500; // Move left two px each frame. Wrap every 14px.
    }
    else {
        best = Math.max(best, score);
    }

    if (currentState === states.Game) {
        ships.update();
    }

    mech.update();
}

/**
 * Re-draw the game view.
 */
function render() {
    // Draw background color
    //renderingContext.fillRect(0, 0, width, height);

    // Draw background sprites
    backgroundSprite.draw(renderingContext, 0, height - backgroundSprite.height);
    backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);

    ships.draw(renderingContext);
    mech.draw(renderingContext);

    // Draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);

    if (currentState === states.Splash) {
        splashState();
    }
    else if (currentState === states.Score) {
        scoreState();
    }
    else {
        gameScore();
    }
}
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
function scoreState() {
    renderingContext.strokeStyle = "white";
    renderingContext.font = "40px Comic Sans MS";
    renderingContext.strokeText("Game Over", 90, 100);
    renderingContext.font = "18px Comic Sans MS";
    renderingContext.strokeText("Score: " + score, 155, 140);
    renderingContext.strokeText("Best: " + best, 160, 170);
    renderingContext.font = "30px Comic Sans MS";
    renderingContext.strokeText("Try Again?", 120, 220);
}
function gameScore() {
    renderingContext.strokeStyle = "white";
    renderingContext.font = "25px Comic Sans MS";
    renderingContext.strokeText("" + score, 185, 50);
}