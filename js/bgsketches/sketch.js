let canvas;

let movers = [];

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    frameRate(24);
    canvas.position(0, 0);
    canvas.style('z-index', '-3000');
    canvas.style('position', 'fixed')
    let numEraser = floor(random(7, 12));
    for (let i = 0; i < numEraser; i++) {
        movers.push(new Eraser(random(100, width - 100), random(100, height - 100), (i + 5) * 10));
    };
    // background(255);
}

function draw() {
    fill(255, 5);
    noStroke();
    rect(0, 0, width, height);

    for (let i = 0; i < movers.length; i++) {
        movers[i].update();
        movers[i].render();
        let intersect = false;
        for (let j = 0; j < movers.length; j++) {

            if (i != j && movers[i].intersects(movers[j])) {
                intersect = true;
            }
        }
        if (intersect) {
            movers[i].r = 127;
            movers[i].g = 127;
            movers[i].b = 220;
            movers[i].a = 10;
        } else {
            movers[i].r = 255;
            movers[i].g = 255;
            movers[i].b = 255;
            movers[i].a = 127;
        }
    }

    // if(millis() >= 60000) noLoop();
}

class Eraser {
    constructor(_x, _y, _rad = 30) {
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.a = 127;

        this.rad = _rad;
        this.x = _x;
        this.y = _y;

        this.incx = random();
        this.incy = random();

        this.xdir = random(-1., 1.);
        this.ydir = random(-1., 1.);
    }

    update() {
        this.incx += .03;
        this.incy += .05;
        this.x += this.xdir * noise(this.incx);
        this.y += this.ydir * noise(this.incy);

        if (this.x >= width - this.rad || this.x <= this.rad) this.xdir = -this.xdir;
        if (this.y >= height - this.rad || this.y <= this.rad) this.ydir = -this.ydir;
    }

    intersects(otherball) {
        if (dist(this.x, this.y, otherball.x, otherball.y) <= this.rad + otherball.rad) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        strokeWeight(0.25);
        stroke(this.r, this.g, this.b, 200);
        noFill();
        ellipse(this.x, this.y, this.rad * 2);
    }
}

function windowResized() {
    canvas = resizeCanvas(windowWidth, windowHeight);
}
