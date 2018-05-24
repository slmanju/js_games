(function () {
    "use strict";

    let canvas = document.getElementById("main_canvas");
    let context = canvas.getContext("2d");
    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;

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

    let CollisionDetector = {
        detect: function (bullets, ships, callback) {
            bullets.forEach(function (bullet) {
                ships.forEach(function (ship) {
                    if (bullet.getBounding().intersects(ship.getBounding())) {
                        bullet.collide();
                        ship.collide();
                        callback();
                    }
                });
            });
        }
    };

    let AssetService = (function () {
        let loadCount = 0;
        let images = {};

        function loadImage(key, src) {
            let image = new Image();
            image.onload = function () {
                loadCount++;
            };
            image.src = src;
            images[key] = image;
        }

        loadImage('background', 'imgs/bg.png');
        loadImage('spaceship', 'imgs/ship.png');
        loadImage('enemy', 'imgs/enemy.png');
        loadImage('bullet', 'imgs/bullet.png');
        loadImage('enemy-bullet', 'imgs/bullet_enemy.png');

        return {
            background: images['background'],
            spaceship: images['spaceship'],
            bullet: images['bullet'],
            enemy: images['enemy'],
            enemyBullet: images['enemy-bullet'],
            isLoaded: function () {
                return loadCount === 5;
            }
        }
    } ());

    function Game() {
        this.state = null;
        this.keys = [];
        this.width = WIDTH;
        this.height = HEIGHT;

        this.score = 0;
        this.level = 1;
        this._lives = 3;
    }

    Game.prototype.hit = function () {
        this._lives--;
    };

    Game.prototype.isDead = function () {
        return this._lives === 3;
    };

    Game.prototype.updateScore = function () {
        this.score = this.score + this.level * 10;
    };

    Game.prototype.levelWon = function () {
        this.score = this.score + this.level * 100;
    };

    Game.prototype.getScore = function () {
        return this.score;
    };

    Game.prototype.init = function () {
        this.state = new WelcomeState(this);

        let game = this;
        document.addEventListener('keydown', function (event) {
            game.keyDown(event.keyCode);
        });

        document.addEventListener('keyup', function (event) {
            game.keyUp(event.keyCode);
        });
    };

    Game.prototype.loop = function () {
        // let game = this;
        // function draw() {
        //     game.draw(context);
        //     requestAnimationFrame(draw);
        // }
        // draw();
    };

    Game.prototype.start = function () {
        this.loop();
    };

    Game.prototype.setState = function (state) {
        this.state = state;
    };

    Game.prototype.keyDown = function (keyCode) {
        this.keys[keyCode] = true;
        this.state.keyDown(this.keys);
    };

    Game.prototype.keyUp = function (keyCode) {
        this.keys[keyCode] = false;
        this.state.keyUp(this.keys);
    };

    Game.prototype.update = function () {
        this.state.update();
    };

    Game.prototype.draw = function () {
        this.state.draw(context);
    };

    function GameState(game) {
        this.game = game;
    }

    GameState.prototype.keyDown = function (keys) {};
    GameState.prototype.keyUp = function (keys) {};
    GameState.prototype.update = function () {};
    GameState.prototype.draw = function () {};

    function WelcomeState(game) {
        GameState.call(this, game);
    }

    WelcomeState.prototype = Object.create(GameState.prototype);
    WelcomeState.prototype.constructor = WelcomeState;

    WelcomeState.prototype.draw = function (context) {
        let game = this.game;
        context.clearRect(0, 0, game.width, game.height);

        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "30px Arial";
        context.fillStyle = '#ffffff';
        context.textBaseline = "center";
        context.textAlign = "center";
        context.fillText("SpaceKru", game.width / 2, game.height / 2 - 40);
        context.font = "16px Arial";

        context.fillText("Press 'Space' to start.", game.width / 2, game.height / 2);
    };

    WelcomeState.prototype.keyDown = function (keys) {
        if (keys[32]) { // space key
            this.game.setState(new LevelIntroState(this.game, 1));
        }
    };

    function LevelIntroState(game, level) {
        GameState.call(this, game);
        this.level = level;
        this.countdownMessage = "3";
        this.countdown = 3; // countdown from 3 secs
        this.timeStart = Date.now();
    }

    LevelIntroState.prototype = Object.create(GameState.prototype);
    LevelIntroState.prototype.constructor = LevelIntroState;

    LevelIntroState.prototype.update = function() {
        let now = Date.now();
        let delta = now - this.timeStart;
        //  Update the countdown.
        this.countdown -= delta / 60000;

        if(this.countdown < 2) {
            this.countdownMessage = "2";
        }
        if(this.countdown < 1) {
            this.countdownMessage = "1";
        }
        if(this.countdown <= 0) {
            this.game.setState(new PlayState(this.game, this.level));
        }
    };

    LevelIntroState.prototype.draw = function (context) {
        context.clearRect(0, 0, game.width, game.height);
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "36px Arial";
        context.fillStyle = '#ffffff';
        context.textBaseline = "center";
        context.textAlign = "center";
        context.fillText("Level " + this.level, game.width / 2, game.height / 2 - 40);
        context.font = "24px Arial";
        context.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height / 2 - 40 + 36);
    };

    function PlayState(game, level) {
        GameState.call(this, game);
        this.level = level;
        this._heroBulletPool = new BulletPool(3);
        this.hero = new Hero(this._heroBulletPool);
        this._enemyBulletPool = new BulletPool(5);
        this._enemyPool = new EnemyPool(10, this._enemyBulletPool);
        this._scoreBoard = new ScoreBoard(game);
    }

    PlayState.prototype = Object.create(GameState.prototype);
    PlayState.prototype.constructor = PlayState;

    PlayState.prototype.update = function() {
        let game = this.game;
        this.hero.update(this.keys);
        CollisionDetector.detect(this._heroBulletPool.bullets, this._enemyPool._objects, function () {
            game.updateScore();
        });
        CollisionDetector.detect(this._enemyBulletPool.bullets, [ this.hero ], function () {
            game.hit();
        });

        if (this._enemyPool._objects.length === 0) {
            game.levelWon();
            game.setState(new GameOverState(game));
        }
    };

    PlayState.prototype.draw = function (context) {
        context.clearRect(0, 0, game.width, game.height);
        this.hero.draw(context);
        this._heroBulletPool.animate(context);
        this._enemyPool.animate(context);
        this._enemyBulletPool.animate(context);
        this._scoreBoard.draw();
    };

    PlayState.prototype.keyDown = function (keys) {
        this.keys = keys;
    };

    PlayState.prototype.keyUp = function (keys) {
        this.keys = keys;
    };

    function GameOverState(game) {
        GameState.call(this, game);
    }

    GameOverState.prototype = Object.create(GameState.prototype);
    GameOverState.prototype.constructor = GameOverState;

    GameOverState.prototype.draw = function (context) {
        let game = this.game;
        context.clearRect(0, 0, game.width, game.height);

        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "30px Arial";
        context.fillStyle = '#ffffff';
        context.textBaseline = "center";
        context.textAlign = "center";
        context.fillText("Game Over", game.width / 2, game.height / 2 - 40);
        context.font = "16px Arial";

        context.fillText("Press 'Space' to start.", game.width / 2, game.height / 2);
    };

    function ScoreBoard(game) {
        this._game = game;
        this._context = document.getElementById("score-board").getContext("2d");
    }

    ScoreBoard.prototype.draw = function () {
        let game = this._game;
        let context = this._context;
        context.clearRect(0, 0, game.width, game.height);

        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "30px Arial";
        context.fillStyle = '#ffffff';
        context.textBaseline = "center";
        context.textAlign = "center";
        context.fillText(game.level + ' : ' + game.getScore(), game.width - 100, 100);
    };

    function Sprite(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = 10;
        this._alive = true;
        this._style = "#140102";
    }

    Sprite.prototype.isAlive = function () {
        return this._alive;
    };

    Sprite.prototype.collide = function () {
        this._alive = false;
    };

    Sprite.prototype.animate = function (context) {
        this.update();
        this.draw(context);
    };

    Sprite.prototype.update = function () {};

    Sprite.prototype.draw = function (context) {
        context.fillStyle = this._style;
        context.fillRect(this.x, this.y, this.size, this.size);
    };

    function Bullet(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = 10;
        this.alive = true;
        this._style = "#140102";
    }

    Bullet.prototype.getBounding = function () {
        return new Rectangle(this.x, this.y, this.size, this.size);
    };

    Bullet.prototype.update = function () {
        this.y = this.y + this.speed;
        if (this.y < 0 || this.y > HEIGHT) {
            this.alive = false;
        }
    };

    Bullet.prototype.collide = function () {
        this.alive = false;
    };

    Bullet.prototype.draw = function (context) {
        context.fillStyle = this._style;
        context.fillRect(this.x, this.y, this.size, this.size);
    };

    function BulletPool(size) {
        this.size = size;
        this.bullets = [];
    }

    BulletPool.prototype.spawn = function (x, y, speed) {
        if (this.bullets.length < this.size) {
            this.bullets.push(new Bullet(x, y, speed));
        }
    };

    BulletPool.prototype.animate = function (context) {
        let i, length = this.bullets.length;
        for (i = 0; i < length; i++) {
            let bullet = this.bullets[i];
            bullet.update();
            if (bullet.alive) {
                bullet.draw(context);
            } else {
                this.bullets.splice(i, 1); // removing dead bullet
                i--; // reset the index
                length--;
            }
        }
    };

    function Enemy(x, y, bulletPool) {
        this.size = 30;
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.direction = 1; // 1 - left, 0 - right
        this.leftEdge = this.x - this.size * 3;
        this.rightEdge = this.x + this.size * 3;
        this.alive = true;
        this.percentFire = .01;
        this._bulletPool = bulletPool;
    }

    Enemy.prototype.getBounding = function () {
        return new Rectangle(this.x, this.y, this.size, this.size);
    };

    Enemy.prototype.move = function() {
        if (this.x < this.leftEdge) {
            this.direction = 0;
            this.y = this.y + 10;
        }
        if (this.x > this.rightEdge) {
            this.direction = 1;
            this.y = this.y + 10;
        }
        if (this.direction === 1) {
            this.x = this.x - this.speed;
        }
        if (this.direction === 0) {
            this.x = this.x + this.speed;
        }
    };

    Enemy.prototype.shoot = function () {
        let chance = Math.floor(Math.random() * 101);
        if (chance / 100 < this.percentFire) {
            this._bulletPool.spawn(this.x + this.size / 2, this.y + this.size, 2.5);
        }
    };

    Enemy.prototype.update = function() {
        this.move();
        this.shoot();
    };

    Enemy.prototype.collide = function () {
        this.alive = false;
    };

    Enemy.prototype.draw = function (context) {
        if (this.alive) {
            context.fillStyle = '#ce6b4d';
            context.fillRect(this.x, this.y, this.size, this.size);
        }
    };

    function EnemyPool(size, bulletPool) {
        this._size = size;
        this._objects = [];
        this._bulletPool = bulletPool;

        let x = 120;
        let y = 30;
        let spacer = y * 1.5;
        for (let i = 1; i <= 15; i++) {
            this.spawn(x, y, 2);
            x += 30 + 25;
            if (i % 5 === 0) {
                x = 120;
                y += spacer;
            }
        }
    }

    EnemyPool.prototype.spawn = function (x, y) {
        if (this._objects.length < this._size) {
            this._objects.push(new Enemy(x, y, this._bulletPool));
        }
    };

    EnemyPool.prototype.animate = function (context) {
        let i, length = this._objects.length;
        for (i = 0; i < length; i++) {
            let object = this._objects[i];
            object.update();
            if (object.alive) {
                object.draw(context);
            } else {
                this._objects.splice(i, 1); // removing dead bullet
                i--; // reset the index
                length--;
            }
        }
    };

    EnemyPool.prototype.getEnemies = function () {
        return this._objects;
    };

    EnemyPool.prototype.forEach = function (callback) {
        this._objects.forEach(function (object) {
            callback(object);
        });
    };

    function Hero(bulletPool) {
        this.size = 30;
        this.x = WIDTH / 2;
        this.y = HEIGHT - this.size;
        this.speed = 3;

        this.lastShootTime = 0;  // time when we last shoot
        this.shootRate = 100;    // time between two bullets. (in ms)

        this._bulletPool = bulletPool;
    }

    Hero.prototype.getBounding = function () {
        return new Rectangle(this.x, this.y, this.size, this.size);
    };

    Hero.prototype.move = function (keys) {
        let movement = (keys && keys[37]) ? -1 : (keys && keys[39]) ? 1 : 0;
        this.x = this.x + this.speed * movement;

        // reset for margins
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.size > WIDTH) {
            this.x = WIDTH - this.size;
        }
    };

    Hero.prototype.shoot = function (keys) {
        let now = Date.now() ;
        if (now - this.lastShootTime  < this.shootRate)  return;
        this.lastShootTime = now;
        if (keys && keys[32]) {
            this._bulletPool.spawn(this.x, this.y, -3);
        }
    };

    Hero.prototype.update = function(keys) {
        this.move(keys);
        this.shoot(keys);
    };

    Hero.prototype.collide = function () {
        this.alive = false;
    };

    Hero.prototype.draw = function (context) {
        context.fillStyle = '#56ce15';
        context.fillRect(this.x, this.y, this.size, this.size);
    };

    let game = new Game();
    game.init();
    game.start();

    function draw() {
        game.update();
        game.draw(context);
        requestAnimationFrame(draw);
    }
    draw();

}());