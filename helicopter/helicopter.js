(function () {
    "use strict";

    var canvas = document.getElementById("helicopter");
    var context = canvas.getContext("2d");
    var helicopterImage = new Image();
    helicopterImage.src = "helicopter.gif";
    var smokeImage = new Image();
    smokeImage.src = "smoke.gif";

    var Graphics = {
        WIDTH: 600,
        HEIGHT: 400,
        NUM_RECS: 25,
        REC_HEIGHT: 50,
        REC_WIDTH: 30,
        MIN_EDGE: 5
    };

    var Const = {
        GRAVITY: 3,
        SPEED_X: 7,
        HELICOPTER_X: 180
    };

    function random(min, max) {
        return Math.round((Math.random() * max) + min);
    }

    function Animator(callback) {
        var now = Date.now(), then = Date.now(), elapsed, fpsInterval = 1000 / 60, requestId;

        this.animate = function animate() {
            requestId = window.requestAnimationFrame(animate);
            now = Date.now();
            elapsed = now - then;
            if (elapsed >= fpsInterval) {
                then = now - (elapsed % fpsInterval);
                callback();
            }
        };

        this.stop = function stop() {
            window.cancelAnimationFrame(requestId);
        };
    }

    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Rectangle.prototype.intersects = function (rectangle) {
        return (this.x < rectangle.x + rectangle.width
            && this.x + this.width > rectangle.x
            && this.y < rectangle.y + rectangle.height
            && this.y + this.height > rectangle.y);
    };

    function Terrain() {
        this.topRecs = [];
        this.bottomRecs = [];
        this.maxX = 0;
        this.edgeGap = Graphics.HEIGHT - (Graphics.MIN_EDGE + Graphics.REC_HEIGHT) * 2;
        var i, topMin = Graphics.MIN_EDGE;
        for(i = 0; i < Graphics.NUM_RECS; i = i + 1)  {
            this.maxX = Graphics.REC_WIDTH * i;
            this.topRecs.push({ x: this.maxX, y: topMin, h: Graphics.REC_HEIGHT });
            this.bottomRecs.push({ x: this.maxX, y: topMin + Graphics.REC_HEIGHT + this.edgeGap, h: Graphics.REC_HEIGHT });
        }
    }

    Terrain.prototype.collide = function (player) {
        var rectangles = [].concat(this.topRecs, this.bottomRecs);
        for (var i = 0; i < rectangles.length; i = i + 1) {
            var rectangle = rectangles[i];
            var rect = new Rectangle(rectangle.x, rectangle.y, Graphics.REC_WIDTH, rectangle.h);
            if (player.intersects(rect)) {
                return true;
            }
        }
        return false;
    };

    Terrain.prototype.update = function () {
        var i, last = Graphics.REC_HEIGHT, plusMinus = 0, newHeight;
        var topMin = Graphics.MIN_EDGE;
        var bottomMax = Graphics.HEIGHT - Graphics.MIN_EDGE;
        for(i = 0; i < Graphics.NUM_RECS; i = i + 1) {
            this.topRecs[i].x = this.topRecs[i].x - Const.SPEED_X;
            this.bottomRecs[i].x = this.bottomRecs[i].x - Const.SPEED_X;
        }
        if (this.topRecs[0].x + Graphics.REC_WIDTH <= 0) {
            this.topRecs.shift();
            this.bottomRecs.shift();

            last = this.topRecs[this.topRecs.length - 1].h;
            plusMinus = Math.round(Math.random());
            var bigOne = Math.round(Math.random() * 10); // throw in the occasional bigger jump in wall positioning...
            if (bigOne === 10) {
                newHeight = Graphics.REC_HEIGHT;
            } else if (plusMinus === 1) {
                newHeight = last + 5;
            } else {
                newHeight = last - 5;
            }
            if (bigOne !== 10 && (newHeight >= Graphics.REC_HEIGHT * 2 || newHeight <= 0)) {
                newHeight = Graphics.REC_HEIGHT;
            }
            var lastX = this.topRecs[this.topRecs.length - 1].x;
            var newX = lastX + Graphics.REC_WIDTH;
            this.topRecs.push({ x: newX, y: topMin, h: newHeight });
            this.bottomRecs.push({ x: newX, y: topMin + newHeight + this.edgeGap, h: bottomMax - (topMin + newHeight + this.edgeGap) });
        }
    };

    Terrain.prototype.draw = function draw() {
        var i, j, k;
        var topMin = Graphics.MIN_EDGE;
        var bottomMax = Graphics.HEIGHT - Graphics.MIN_EDGE;
        context.save();
        context.beginPath();
        context.fillStyle = "#66FF66";
        context.strokeStyle = "#5CE65C";
        context.fillRect(0, 0, Graphics.WIDTH, Graphics.MIN_EDGE);
        context.fillRect(0, bottomMax, Graphics.WIDTH, Graphics.MIN_EDGE);
        for(i = 0; i < Graphics.NUM_RECS; i = i + 1) {
            context.fillRect(this.topRecs[i].x, topMin, Graphics.REC_WIDTH, this.topRecs[i].h);
            context.fillRect(this.bottomRecs[i].x, this.bottomRecs[i].y, Graphics.REC_WIDTH, this.bottomRecs[i].h);

            // add horizontal lines, this is not good. better use an image
            for (j = topMin; j <= topMin + this.topRecs[i].h; j = j + 5) {
                context.moveTo(this.topRecs[i].x, 0.5 + j);
                context.lineTo(this.topRecs[i].x + Graphics.REC_WIDTH, 0.5 + j);
            }
            for (k = this.bottomRecs[i].y; k <= this.bottomRecs[i].y + this.bottomRecs[i].h; k = k + 5) {
                context.moveTo(this.bottomRecs[i].x, 0.5 + k);
                context.lineTo(this.bottomRecs[i].x + Graphics.REC_WIDTH, 0.5 + k);
            }
        }
        context.stroke();
        context.restore();
    };

    function Obstacle(x) {
        this.x = x;
        this.y = Graphics.HEIGHT / 2;
        this.width = 30;
        this.height = 85;
    }

    Obstacle.prototype.move = function () {
        this.x = this.x - Const.SPEED_X;
        var topMin = Graphics.MIN_EDGE;
        var obstacleGap = 3 * Graphics.WIDTH / 4;
        var edgeGap = Graphics.HEIGHT - (Graphics.MIN_EDGE + Graphics.REC_HEIGHT) * 2;
        if (this.x + 30 < 0) {
            this.x = obstacleGap * 2;
            this.y = topMin + random(50, edgeGap - 100);
        }
    };

    Obstacle.prototype.draw = function () {
        context.save();
        context.beginPath();
        context.fillStyle = "#66FF66";
        context.fillRect(this.x, this.y, 30, 85);
        context.restore();
    };

    function ObstaclePool() {
        var obstacle1 = new Obstacle(Graphics.WIDTH);
        var obstacle2 = new Obstacle(obstacle1.x + 3 * Graphics.WIDTH / 4);
        this.obstacles = [];
        this.obstacles.push(obstacle1);
        this.obstacles.push(obstacle2);

        this.move = function () {
            this.obstacles.forEach(function (obstacle) {
                obstacle.move();
            });
        };

        this.draw = function () {
            this.obstacles.forEach(function (obstacle) {
                obstacle.draw();
            });
        };

        this.collide = function (player) {
            var rect1 = new Rectangle(obstacle1.x, obstacle1.y, obstacle1.width, obstacle1.height);
            var rect2 = new Rectangle(obstacle2.x, obstacle2.y, obstacle2.width, obstacle2.height);
            return (player.intersects(rect1) || player.intersects(rect2));
        };
    }

    function Player(x, y) {
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 32;
        this.SPEED_X = 0;
        this.maxSPEED_X = 5;
        this.distance = 0;
        this.smoke = new Smoke();
    }

    Player.prototype.draw = function () {
        context.drawImage(helicopterImage, this.x, this.y);
        this.smoke.draw();
    };

    Player.prototype.move = function (mouseDown) {
        if (mouseDown) {
            this.SPEED_X = (this.SPEED_X < this.maxSPEED_X) ? (this.SPEED_X + 0.1) : this.maxSPEED_X;
            this.y = this.y - this.SPEED_X;
        } else {
            this.y = this.y + Const.GRAVITY;
            this.SPEED_X = 0;
        }
        this.smoke.move(this.y);
        this.distance = this.distance + 1 / 4;
    };

    Player.prototype.moveUp = function () {
        this.y = this.y - (1000 / 60) * 2;
    };

    Player.prototype.rect = function () {
        return new Rectangle(this.x, this.y, this.width, this.height);
    };

    function Smoke() {
        var smokes = [];
        var GAP = 20;
        for (var i = 0; i < Const.HELICOPTER_X - GAP; i = i + GAP) {
            smokes.push({ x: i, y: Graphics.HEIGHT / 2 });
        }
        this.move = function (y) {
            for (var i = 0; i < smokes.length; i = i + 1) {
                smokes[i].x = smokes[i].x - Const.SPEED_X;
            }
            var last = smokes[smokes.length - 1];
            if (smokes[0].x < 0) {
                smokes.shift();
                smokes.push({ x: Const.HELICOPTER_X - GAP, y: y })
            }
            last.y = y;
        };
        this.draw = function () {
            smokes.forEach(function (smoke) {
                context.drawImage(smokeImage, smoke.x, smoke.y);
            });
        };
    }

    function Game() {
        this.player = null;
        this.animator = null;
        this.terrain = null;
        this.obstacles = null;
        this.mouseDown = false;
        this.state = "stop";
    }

    Game.prototype.initialize = function () {
        var self = this;
        this.player = new Player(Const.HELICOPTER_X, Graphics.HEIGHT / 2);
        this.terrain = new Terrain();
        this.obstacles = new ObstaclePool();
        this.state = "stop";
        context.clearRect(0, 0, Graphics.WIDTH, Graphics.HEIGHT);
        this.terrain.draw();
        this.player.draw();
        this.animator = new Animator(function () {
            if (self.obstacles.collide(self.player.rect()) ||
                self.terrain.collide(self.player.rect())) {
                self.over();
            } else {
                context.clearRect(0, 0, Graphics.WIDTH, Graphics.HEIGHT);
                self.player.move(self.mouseDown);
                self.terrain.update();
                self.obstacles.move();
                self.terrain.draw();
                self.obstacles.draw();
                self.player.draw();
                self.updateScore();
            }
        });
        canvas.addEventListener("mousedown", function (event) {
            event.preventDefault();
            self.mouseDown = true;
            if (self.state === "stop") {
                self.start();
                self.state = "start";
            }
        }, false);
        canvas.addEventListener("mouseup", function (event) {
            event.preventDefault();
            self.mouseDown = false;
        }, false);

        this.message();
        this.updateScore();
    };

    Game.prototype.start = function () {
        this.animator.animate();
    };

    Game.prototype.stop = function () {
        this.animator.stop();
    };

    Game.prototype.message = function () {
        var howTo = "CLICK AND HOLD LEFT MOUSE BUTTON TO GO UP";
        context.font = "20px Courier";
        context.fillStyle = "#87CEFA";
        context.fillText("CLICK TO START", Const.HELICOPTER_X + 110, Graphics.HEIGHT / 2 + 20);
        context.font = "14px Courier";
        context.fillText(howTo, Const.HELICOPTER_X - 50, Graphics.HEIGHT / 2 + 80);
        context.fillText("RELEASE TO GO DOWN", Const.HELICOPTER_X + 142, Graphics.HEIGHT / 2 + 110);
    };

    Game.prototype.updateScore = function () {
        context.font = "18px Courier";
        context.fillStyle = "#000";
        context.fillText("DISTANCE: " + Math.round(this.player.distance), 15, Graphics.HEIGHT - 15);
    };

    Game.prototype.over = function () {
        this.animator.stop();
        context.beginPath();
        context.strokeStyle = "red";
        context.arc(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 50, 0, 2 * Math.PI);
        context.stroke();
        setTimeout(this.initialize.bind(this), 2000);
    };

    var game = new Game();
    game.initialize();

}());
