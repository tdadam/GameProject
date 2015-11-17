/**
 * Created by tdadam on 11/11/15.
 */
// Sprite variables

var
    mechSprite,
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

    backgroundSprite = new Sprite(img, 0, 162, 250, 223);
    //backgroundSprite.color = "#ABE1EE";
    foregroundSprite = new Sprite(img, 0, 389, 250, 32);

    //okButtonSprite = new Sprite(img, 189, 4, 43, 44);
    okButtonSprite = new Sprite(img, 192, 52, 37, 37);
}