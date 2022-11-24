const canvas = document.getElementById("canvas");
canvas.height = window.innerHeight / 1.5;
if (window.innerWidth >= 1000) {
    canvas.width = window.innerWidth / 2.5;
}

if (window.innerWidth < 1000) {
    canvas.width = window.innerWidth / 1.3;
}

const c = canvas.getContext("2d");

const G = 0.03;
const resitutionCoef = 0.6;
const frictionCoef = 0.9;
let gravity = false;

const colors = ["#EF626C", "#F6E8EA", "#22181C", "#312F2F", "#84DCCF"];

class Ball {
    constructor(x, y, dx, dy, color, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.bouncingY = false;
        this.color = color;
        this.radius = radius;
    }

    draw = () => {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        c.fill();
    };

    move = () => {
        this.x += this.dx;
        this.y += this.dy;
    };

    bounce = () => {
        if (this.x + this.radius > canvas.width) this.dx = -Math.abs(this.dx);
        if (this.x - this.radius < 0) this.dx = Math.abs(this.dx);
        if (this.y + this.radius > canvas.height)
            (this.dy = -Math.abs(this.dy)), (this.bouncingY = true);
        if (this.y - this.radius < 0) this.dy = Math.abs(this.dy);
    };

    gravity = () => {
        this.dy += G;
    };

    restitution = () => {
        if (this.bouncingY)
            (this.dy = this.dy * resitutionCoef),
                (this.dx = this.dx * frictionCoef);
    };
}

const balls = [];

for (let i = 0; i < 35; i++) {
    const radius = Math.random() * 12 + 10;
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = Math.random() * (canvas.height - 2 * radius) + radius;
    const dx = (Math.random() - 0.5) * 0.7;
    const dy = (Math.random() - 0.5) * 0.7;
    const color = colors[parseInt(Math.random() * colors.length)];
    const ball = new Ball(x, y, dx, dy, color, radius);
    balls.push(ball);
}

function frame() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (const ball of balls) animateBall(ball);
}

function animateBall(ball) {
    if (gravity) ball.gravity(), ball.restitution();
    ball.bouncingY = false;
    ball.bounce();
    ball.move();
    ball.draw();
}

let interval;

let ballAnimationRunning = false;

function startBallAnimation() {
    interval = setInterval(frame, 5);
    ballAnimationRunning = true;
}

function stopBallAnimation() {
    clearInterval(interval);
    ballAnimationRunning = false;
}

startBallAnimation();
