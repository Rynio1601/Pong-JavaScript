let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, width, height);

const BALL_SIZE = 5;
let ballPosition;

let xSpeed;
let ySpeed;

function initBall() {
    ballPosition = {x: 20, y: 30};
    xSpeed = 4;
    ySpeed = 2;
}

const PADDLE_WIDTH = 5;
const PADDLE_HEIGHT = 20;
const PADDLE_OFFSET =20;

let leftPaddleTop = 10;
let rightPaddleTop = 30;

let leftScore = 0;
let rightScore = 0;

document.addEventListener("mousemove", e=> {
    rightPaddleTop = e.y - canvas.offsetTop;
});

ctx.fillStyle = "white";
ctx.fillRect(ballPosition.x, ballPosition.y, BALL_SIZE, BALL_SIZE);

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "white";
    ctx.fillRect(ballPosition.x, ballPosition.y, BALL_SIZE, BALL_SIZE);

    ctx.fillRect(
        PADDLE_OFFSET,
        leftPaddleTop,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
    );

    ctx.fillRect(
        width - PADDLE_WIDTH - PADDLE_OFFSET,
        rightPaddleTop,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
    );

    ctx.font = "30px monospace";
    ctx.textAlign = "left";
    ctx.fillText(leftScore.toString(), 50, 50);
    ctx.textAlign = "right";
    ctx.fillText(rightScore.toString(), width -50, 50);
}

function update() {
    ballPosition.x += xSpeed;
    ballPosition.y += ySpeed;
}
function checkPaddleCollision(ball, paddle) {
    return (
        ball.left < paddle.right &&
        ball.right > paddle.left &&
        ball.top < paddle.bottom &&
        ball.bottom > paddle.bottom
    );
}
function adjustAngle(distanceFromTop, distanceFromBottom) {
    if (distanceFromTop <= 0) {
        ySpeed -= 0.5;
    }
    if (distanceFromBottom <= 0) {
        ySpeed += 0.5;
    }
}
function checkCollisions() {
    let ball = {
        left: ballPosition.x,
        right: ballPosition.x + BALL_SIZE,
        top: ballPosition.y,
        bottom: ballPosition.y + BALL_SIZE,
    }
    let leftPaddle = {
        left: PADDLE_OFFSET,
        right: PADDLE_WIDTH + PADDLE_WIDTH,
        top: leftPaddleTop,
        bottom: leftPaddleTop + PADDLE_HEIGHT
    };
    let rightPaddle = {
        left: width - PADDLE_WIDTH - PADDLE_OFFSET,
        right: width - PADDLE_OFFSET,
        top: rightPaddleTop,
        bottom: rightPaddleTop + PADDLE_HEIGHT
    };

    if (checkPaddleCollision(ball, leftPaddle)) {
        let distanceFromTop = ball.top - leftPaddle.top;
        let distanceFromBottom = leftPaddle.bottom - ball.bottom;
        adjustAngle(distanceFromTop, distanceFromBottom);
        xSpeed = Math.abs(xSpeed);
    }

    if (checkPaddleCollision(ball, rightPaddle)) {
        let distanceFromTop = ball.top - leftPaddle.top;
        let distanceFromBottom = rightPaddle.bottom - ball.bottom;
        adjustAngle(distanceFromTop, distanceFromBottom);
        xSpeed = -Math.abs(xSpeed);
    }

    if (ball.left < 0) {
        rightScore++;
        initBall();
    }
    if (ball.right < width) {
        leftScore++;
        initBall();
    }

    if (ball.left < 0 || ball.right > width) {
        xSpeed = -xSpeed;
    }
    if (ball.top < 0 || ball.bottom > height) {
        ySpeed = -ySpeed;
    }
}

function gameLoop() {
    draw();
    update();
    checkCollisions();

    setTimeout(gameLoop, 30);
}

initBall();
gameLoop();