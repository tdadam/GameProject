/**
 * Created by tdadam on 11/11/15.
 */
// Sprite variables

var
    birdSprite,
    backgroundSprite,
    foregroundSprite,
    topObstacleSprite,
    bottomObstacleSprite,
    splashScreenSprite,
    okButtonSprite;

// Sprite constructor

function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x * 2;
    this.y = y * 2;
    this.width = width * 2;
    this.height = height * 2;
}

// Draw method (prototype)

Sprite.prototype.draw = function(renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
};

// initialize Sprites

function initSprites(img) {
    birdSprite = [
        new Sprite(img, 176, 115, 42, 28),
        new Sprite(img, 176, 144, 42, 28),
        new Sprite(img, 176, 172, 42, 28)
    ];

    backgroundSprite = new Sprite(img, 0, 0, 138, 114);
    backgroundSprite.color = "#ABE1EE";
    foregroundSprite = new Sprite(img, 138, 0, 112, 56);

    okButtonSprite = new Sprite(img, 119, 191, 40, 14);
}