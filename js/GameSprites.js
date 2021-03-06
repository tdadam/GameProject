/**
 * Created by tdadam on 11/11/15.
 */
// Sprite variables
var
    mechSprite,
    backgroundSprite,
    foregroundSprite,
    topObstacleSprite,
    bottomObstacleSprite;

// Sprite constructor
function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x * 2;
    this.y = y * 2;
    this.width = width * 2;
    this.height = height * 2;
}

// Draw method (prototype)
Sprite.prototype.draw = function (renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
};

// initialize Sprites
function initSprites(img) {
    mechSprite = [
        new Sprite(img, 8, 5, 33, 38),
        new Sprite(img, 8, 46, 33, 38),
        new Sprite(img, 8, 88, 33, 38)
    ];

    //background image and moving ground
    backgroundSprite = new Sprite(img, 0, 162, 250, 223);
    foregroundSprite = new Sprite(img, 0, 389, 250, 32);

    //obstacles
    topObstacleSprite = new Sprite(img, 114, 1, 50, 152);
    bottomObstacleSprite = new Sprite(img, 50, 1, 50, 152);
}