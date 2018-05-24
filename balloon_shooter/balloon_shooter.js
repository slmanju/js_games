(function (namespace) {
    "use strict";

    var canvas = document.getElementById("main_canvas");
    var context = canvas.getContext("2d");

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function Noise() {
        this.value = 0;
        this.maxvalue = 1;
        this.large = 0.1;
    }
    
    Noise.prototype.next = function () {
        var plusMinus = Math.round(Math.random());
        var bigOne = getRandom(0, this.large);
        if (bigOne === this.large) {
            this.value = this.maxvalue;
        } else if (plusMinus === 1) {
            this.value = this.value + 0.1;
        } else {
            this.value = this.value - 0.1;
        }
        if (this.value > this.maxvalue || this.value < 0) {
            this.value = this.maxvalue;
        }
        return this.value;
    };

    function Balloon() {
        this.x = 10;
        this.y = canvas.height / 4;
        this.direction = 1;
        this.sin = 0;
        this.noise = new Noise();
    }

    Balloon.prototype.update = function () {
        this.y = canvas.height / 2 + getRandom(20, 22) * Math.sin(this.sin);
        this.sin = this.sin + 0.001 + this.noise.next() / 10;

        if (this.x <= 10) {
            this.direction = 1;
        }
        if (this.x >= 480) {
            this.direction = -1;
        }
        this.x = this.x + Math.random() * this.direction;
    };

    Balloon.prototype.draw = function () {
        context.beginPath();
        context.fillRect(this.x, this.y, 20, 20);
        context.stroke();
    };

    var balloon = new Balloon();
    function draw() {
        context.clearRect(0, 0, 500, 500);
        balloon.update();
        balloon.draw();
        requestAnimationFrame(draw);
    }

    draw();

    namespace.Noise = Noise;
}(window));