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
//At this point, matches original without coral
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


    duck, //playable character
//corals,

    //state vars
    currentState,

//splash, gameplay. score
    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    };

function Duck() {
    this.x = 140;
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 1]; // The animation sequence

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 4.6;

    /**
     * Makes the Duck jump
     */
    this.jump = function () {
        this.velocity = -this._jump;
    };

    /**
     * Update sprite animation and position of Duck
     */
    this.update = function () {
// Play animation twice as fast during game state
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdleDuck();
        } else { // Game state
            this.updatePlayingDuck();
        }
    };

    /**
     * Runs the duck through its idle animation.
     */
    this.updateIdleDuck = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    /**
     * Determines duck animation for the player-controlled duck.
     */
    this.updatePlayingDuck = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

// Change to the score state when duck touches the ground
        if (this.y >= height - foregroundSprite.height - 10) {
            this.y = height - foregroundSprite.height - 10;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }

// When duck lacks upward momentum increment the rotation angle
        if (this.velocity >= this._jump) {
            this.frame = 1;
            this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
        } else {
            this.rotation = -0.3;
        }
    };

    /**
     * Draws Duck to canvas renderingContext
     * @param {CanvasRenderingContext2D} renderingContext the context used for drawing
     */
    this.draw = function (renderingContext) {
        renderingContext.save();

// translate and rotate renderingContext coordinate system
        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

// draws the duck with center in origo
        duckSprite[n].draw(renderingContext, -duckSprite[n].width / 2, -duckSprite[n].height / 2);

        renderingContext.restore();
    };
}

function onpress(evt) {
    switch(currentState) {
        case state.Splash: //start the game and update the duck velocity
            currentState = state.Game;
            duck.jump();
            break;
        case state.Game: //game in progress, update velocity
            duck.jump();
            break;
        case state.Score: //change from score to splash on button
            //getting event location
            var mouseX = evt.offsetX, mouseY = evt.offsetY;
            if (mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }
            //check hitting the button
            if (okButton.x < mouseX && mouseX < okButton.width && okButton.y < mouseY && mouseY < okButton.height) {
                currentState = state.Splash;
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
        height = 430;
        inputEvent = "mousedown";
    }

    //create listener for input event
    document.addEventListener(inputEvent, onpress);
}

function main() {
    canvasSetup();
    document.body.appendChild(canvas);
    loadGraphics();
}

function canvasSetup(){
    canvas = document.createElement("canvas");
    canvas.style.border = "1px solid black";
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext("2d");
}

function loadGraphics(){
    var img = new Image();
    img.src = "./images/sheet.png";
    img.onload = function() {
        initSprites(this);
        renderingContext.fillStyle = backgroundSprite.color;
        renderingContext.fillRect(0, 0, 300, 500);
    };
    gameLoop();
}

function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

/**
 * Updates all moving sprites: foreground, fish, and corals
 */
function update() {
    frames++;

    if (currentState !== states.Score) {
        foregroundPosition = (foregroundPosition - 2) % 14; // Move left two px each frame. Wrap every 14px.
    }

    if (currentState === states.Game) {
        //corals.update();
    }

    fish.update();
}

/**
 * Re-draw the game view.
 */
function render() {
    // Draw background color
    renderingContext.fillRect(0, 0, width, height);

    // Draw background sprites
    backgroundSprite.draw(renderingContext, 0, height - backgroundSprite.height);
    backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);

    //corals.draw(renderingContext);
    fish.draw(renderingContext);

    // Draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);
}
