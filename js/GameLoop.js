/**
 * Created by tdadam on 11/11/15.
 */
var canvas, renderingContext, width, height, sprite,

    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    };



function main() {
    canvasSetup();
    document.body.appendChild(canvas);
    loadGraphics();
}

function canvasSetup(){
    canvas = document.createElement("canvas");
    canvas.style.border = "1px solid black";
    canvas.width = 300;
    canvas.height = 500;
    renderingContext = canvas.getContext("2d");
}

function loadGraphics(){
    sprite = new Image();
    sprite.src = "./images/bird.png";
    sprite.onload = function() {
        renderingContext.fillStyle = "#70C5CF";
        renderingContext.fillRect(0, 0, 300, 500);
        renderingContext.drawImage(sprite, 10, 10);
    }
}