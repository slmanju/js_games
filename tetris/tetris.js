(function () {
    "use strict";

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    } ());

    var ColorCode = {
        T: { code: 1, color: "#FF0000" },
        O: { code: 2, color: "#0000FF" },
        J: { code: 3, color: "#228B22" },
        S: { code: 4, color: "#FF1493" },
        Z: { code: 5, color: "#8B008B" },
        L: { code: 6, color: "#FFFF00" },
        I: { code: 7, color: "#000000" },
        get: function (code) {
            switch (code) {
                case 1:
                    return ColorCode.T.color;
                case 2:
                    return ColorCode.O.color;
                case 3:
                    return ColorCode.J.color;
                case 4:
                    return ColorCode.S.color;
                case 5:
                    return ColorCode.Z.color;
                case 6:
                    return ColorCode.L.color;
                default:
                    return ColorCode.I.color;
            }
        }
    };

    function KeyHandler() {
        this.KEY_CODES = {
            32: 'space',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        this.KEY_STATUS = {
            32: false,
            37: false,
            38: false,
            39: false,
            40: false
        };
    }

    KeyHandler.prototype.onkeypress = function (e, down) {
        // Firefox and opera use charCode instead of keyCode to return which key was pressed.
        var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
        if (this.KEY_CODES[keyCode]) {
            e.preventDefault();
            this.KEY_STATUS[this.KEY_CODES[keyCode]] = down;
        }
    };

    KeyHandler.prototype.keydown = function (e) {
        this.onkeypress(e, true);
    };

    KeyHandler.prototype.keyup = function (e) {
        this.onkeypress(e, false);
    };

    KeyHandler.prototype.getKeyStatus = function () {
        return this.KEY_STATUS;
    };

    function Tetromino(context) {
        this.col = 3;
        this.row = 0;
        this.context = context;
        this.index = 0;
        this.fillStyle = "red";
        var code = ColorCode.O.code;
        this.shapes = [
            [
                [ 0, code, code, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, code, code, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, code, code, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, code, code, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ]
        ];
        this.shape = this.shapes[this.index];
    }

    Tetromino.prototype.constructor = Tetromino;

    Tetromino.prototype.init = function () {
        this.col = 3;
        this.row = 0;
        this.index = 0;
        this.shape = this.shapes[this.index];
    };

    Tetromino.prototype.moveDown = function () {
        this.row = this.row + 1;
    };

    Tetromino.prototype.moveLeft = function () {
        this.col = this.col - 1;
    };

    Tetromino.prototype.moveRight = function () {
        this.col = this.col + 1;
    };

    Tetromino.prototype.rotateLeft = function () {
        this.index = this.index - 1;
        if (this.index < 0) {
            this.index = 3;
        }
        this.shape = this.shapes[this.index];
    };

    Tetromino.prototype.rotateRight = function () {
        this.index = this.index + 1;
        if (this.index > 3) {
            this.index = 0;
        }
        this.shape = this.shapes[this.index];
    };

    Tetromino.prototype.draw = function () {
        var shape = this.shape;
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                if (shape[row][col] > 0) {
                    this.context.save();
                    this.context.beginPath();
                    this.context.fillStyle = this.fillStyle;
                    this.context.fillRect(this.col * 30 + col * 30, this.row * 30 + row * 30, 30, 30);
                    this.context.strokeStyle = "#DCDCDC";
                    this.context.lineWidth = 1;
                    this.context.strokeRect(this.col * 30 + col * 30, this.row * 30 + row * 30, 30, 30);
                    this.context.restore();
                }
            }
        }
    };

    function TetrominoT(context) {
        Tetromino.call(this, context);
        this.fillStyle = ColorCode.T.color;
        var code = ColorCode.T.code;
        this.shapes = [
            [
                [ code, code, code, 0 ],
                [ 0, code, 0, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, 0, code, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, code, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, 0, 0, 0 ],
                [ 0, code, 0, 0 ],
                [ code, code, code, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ code, 0, 0, 0 ],
                [ code, code, 0, 0 ],
                [ code, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ]
        ];
    }

    TetrominoT.prototype = Object.create(Tetromino.prototype);
    TetrominoT.prototype.constructor = TetrominoT;

    function TetrominoO(context) {
        Tetromino.call(this, context);
        this.fillStyle = ColorCode.O.color;
        var code = ColorCode.O.code;
        this.shapes = [
            [
                [ 0, code, code, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, code, code, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, code, code, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, code, code, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ]
        ];
    }

    TetrominoO.prototype = Object.create(Tetromino.prototype);
    TetrominoO.prototype.constructor = TetrominoO;

    function TetrominoJ(context) {
        Tetromino.call(this, context);
        this.fillStyle = ColorCode.J.color;
        var code = ColorCode.J.code;
        this.shapes = [
            [
                [ 0, code, 0, 0 ],
                [ 0, code, 0, 0 ],
                [ code, code, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ code, 0, 0, 0 ],
                [ code, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, code, code, 0 ],
                [ 0, code, 0, 0 ],
                [ 0, code, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, 0, 0, 0 ],
                [ code, code, code, 0 ],
                [ 0, 0, code, 0 ],
                [ 0, 0, 0, 0 ]
            ]
        ];
    }

    TetrominoJ.prototype = Object.create(Tetromino.prototype);
    TetrominoJ.prototype.constructor = TetrominoJ;

    function TetrominoS(context) {
        Tetromino.call(this, context);
        this.fillStyle = ColorCode.S.color;
        var code = ColorCode.S.code;
        this.shapes = [
            [
                [ 0, code, code, 0 ],
                [ code, code, 0, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, code, 0, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, code, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, 0, 0, 0 ],
                [ 0, code, code, 0 ],
                [ code, code, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ code, 0, 0, 0 ],
                [ code, code, 0, 0 ],
                [ 0, code, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ]
        ];
    }

    TetrominoS.prototype = Object.create(Tetromino.prototype);
    TetrominoS.prototype.constructor = TetrominoS;

    function TetrominoZ(context) {
        Tetromino.call(this, context);
        this.fillStyle = ColorCode.Z.color;
        var code = ColorCode.Z.code;
        this.shapes = [
            [
                [ code, code, 0, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, 0, code, 0 ],
                [ 0, code, code, 0 ],
                [ 0, code, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, 0, 0, 0 ],
                [ code, code, 0, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, code, 0, 0 ],
                [ code, code, 0, 0 ],
                [ code, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ]
        ];
    }

    TetrominoZ.prototype = Object.create(Tetromino.prototype);
    TetrominoZ.prototype.constructor = TetrominoZ;

    function TetrominoL(context) {
        Tetromino.call(this, context);
        this.fillStyle = ColorCode.L.color;
        var code = ColorCode.L.code;
        this.shapes = [
            [
                [ 0, code, 0, 0 ],
                [ 0, code, 0, 0 ],
                [ 0, code, code, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, 0, 0, 0 ],
                [ code, code, code, 0 ],
                [ code, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ code, code, 0, 0 ],
                [ 0, code, 0, 0 ],
                [ 0, code, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, 0, code, 0 ],
                [ code, code, code, 0 ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ]
        ];
    }

    TetrominoL.prototype = Object.create(Tetromino.prototype);
    TetrominoL.prototype.constructor = TetrominoL;

    function TetrominoI(context) {
        Tetromino.call(this, context);
        this.fillStyle = ColorCode.I.color;
        var code = ColorCode.I.code;
        this.shapes = [
            [
                [ 0, 0, code, 0 ],
                [ 0, 0, code, 0 ],
                [ 0, 0, code, 0 ],
                [ 0, 0, code, 0 ]
            ],
            [
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ],
                [ code, code, code, code ],
                [ 0, 0, 0, 0 ]
            ],
            [
                [ 0, code, 0, 0 ],
                [ 0, code, 0, 0 ],
                [ 0, code, 0, 0 ],
                [ 0, code, 0, 0 ]
            ],
            [
                [ 0, 0, 0, 0 ],
                [ code, code, code, code ],
                [ 0, 0, 0, 0 ],
                [ 0, 0, 0, 0 ]
            ]
        ];
    }

    TetrominoI.prototype = Object.create(Tetromino.prototype);
    TetrominoI.prototype.constructor = TetrominoI;

    function TetrominoPool(context) {
        this.context = context;
        this.tetrominos = [];
        this.tetrominos.push(new TetrominoT(this.context));
        this.tetrominos.push(new TetrominoI(this.context));
        this.tetrominos.push(new TetrominoJ(this.context));
        this.tetrominos.push(new TetrominoL(this.context));
        this.tetrominos.push(new TetrominoO(this.context));
        this.tetrominos.push(new TetrominoS(this.context));
        this.tetrominos.push(new TetrominoZ(this.context));
    }

    TetrominoPool.prototype.constructor = TetrominoPool;

    TetrominoPool.prototype.get = function () {
        var tetromino = this.tetrominos[Math.floor(Math.random() * 7)];
        tetromino.init();
        return tetromino;
    };

    function Game() {
        this.canvas = document.getElementById("tetris");
        this.context = this.canvas.getContext("2d");
        this.tetrominos = new TetrominoPool(this.context);
        this.tetromino = this.tetrominos.get();
        this.board = [];
        this.landed = [];
    }

    Game.prototype.init = function () {
        for (var row = 0; row < 16; row = row + 1) {
            this.landed[row] = [];
            this.board[row] = [];
            for (var col = 0; col < 10; col = col + 1) {
                this.landed[row][col] = (row > 13 && (col < 3 || col > 7)) ? 1 : 0;
                this.board[row][col] = 0;
            }
        }
    };

    Game.prototype.drawBoard = function () {
        for (var row = 0; row < 16; row++) {
            for (var col = 0; col < 10; col++) {
                this.context.save();
                this.context.beginPath();
                this.context.fillStyle = "#D3D3D3";
                this.context.rect(col * 30, row * 30, 30, 30);
                this.context.fill();
                this.context.strokeStyle = "#C0C0C0";
                this.context.stroke();
                this.context.restore();
            }
        }
    };

    Game.prototype.drawLanded = function () {
        for (var row = 0; row < 16; row++) {
            for (var col = 0; col < 10; col++) {
                if (this.landed[row][col] > 0) {
                    this.context.save();
                    this.context.beginPath();
                    this.context.fillStyle = ColorCode.get(this.landed[row][col]);
                    this.context.fillRect(col * 30, row * 30, 30, 30);
                    this.context.strokeStyle = "#DCDCDC";
                    this.context.strokeRect(col * 30, row * 30, 30, 30);;
                    this.context.stroke();
                    this.context.restore();
                }
            }
        }
    };

    Game.prototype.attachListeners = function () {

    };

    Game.prototype.isLanded = function () {
        var row, col, taken = false;
        for (row = 0; row < 4; row = row + 1) {
            for (col = 0; col < 4; col = col + 1) {
                if (this.tetromino.shape[row][col] > 0) {
                    if ((row + this.tetromino.row >= this.landed.length) || (this.landed[row + this.tetromino.row][col + this.tetromino.col] > 0)) {
                        taken = true;
                    }
                }
            }
        }
        return taken;
    };

    Game.prototype.collideWall = function () {
        var row, col, taken = false;
        for (row = 0; row < 4; row = row + 1) {
            for (col = 0; col < 4; col = col + 1) {
                if (this.tetromino.shape[row][col] !== 0) {
                    if (col + this.tetromino.col < 0) {
                        //this block would be to the left of the playing field
                        taken = true;
                    }
                    if (col + this.tetromino.col >= this.landed[0].length) {
                        //this block would be to the right of the playing field
                        taken = true;
                    }
                    if (this.landed[row + this.tetromino.row] !== 0 && this.landed[col + this.tetromino.col] !== 0) {
                        //the space is taken
                        taken = true;
                    }
                }
            }
        }
        return taken;
    };

    Game.prototype.addToLanded = function () {
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                if (this.tetromino.shape[row][col] > 0) {
                    this.landed[row + this.tetromino.row - 1][col + this.tetromino.col] = this.tetromino.shape[row][col];
                }
            }
        }
    };

    Game.prototype.start = function () {
        this.loop();
    };

    Game.prototype.loop = function () {
        this.context.clearRect(0, 0, 300, 480);
        this.drawBoard();
        if (this.isLanded()) {
            this.addToLanded();
            this.tetromino = this.tetrominos.get();
        }
        this.drawLanded();
        this.tetromino.draw();
        this.tetromino.moveDown();
    };

    Game.prototype.move = function (key) {
        var potentialCol = (key === Key.Left) ? this.tetromino.col - 1 : this.tetromino.col + 1,
            potentialRow = this.tetromino.row,
            movable = true;
        for (var row = 0; row < this.tetromino.shape.length; row++) {
            for (var col = 0; col < this.tetromino.shape[row].length; col++) {
                if (this.tetromino.shape[row][col] !== 0) {
                    if (col + potentialCol < 0) { //this block would be to the left of the playing field
                        movable = false;
                    }
                    if (col + potentialCol >= this.landed[0].length) { //this block would be to the right of the playing field
                        movable = false;
                    }
                    if (this.landed[row + potentialRow][col + potentialCol] !== 0) { //the space is taken
                        movable = false;
                    }
                }
            }
        }
        if (movable) {
            if (key === Key.Left) {
                this.tetromino.moveLeft();
            } else {
                this.tetromino.moveRight();
            }
        }
    };

    Game.prototype.rotate = function (key) {
        var index = this.tetromino.index;
        var potentialIndex = (key === Key.Up) ? index - 1 : index + 1;
        if (potentialIndex < 0) {
            potentialIndex = 3;
        }
        if (potentialIndex > 3) {
            potentialIndex = 0;
        }
        var potentialShape = this.tetromino.shapes[potentialIndex];
        var rotatable = true;
        for (var row = 0; row < 4; row = row + 1) {
            for (var col = 0; col < 4; col = col + 1) {
                if (potentialShape[row][col] !== 0) {
                    if (col + this.tetromino.col < 0) {
                        //this block would be to the left of the playing field
                        rotatable = false;
                    }
                    if (col + this.tetromino.col >= this.landed[0].length) {
                        //this block would be to the right of the playing field
                        rotatable = false;
                    }
                    if (row + this.tetromino.row >= this.landed.length) {
                        //this block would be below the playing field
                        rotatable = false;
                    }
                    if (this.landed[row + this.tetromino.row][col + this.tetromino.col] !== 0) {
                        //the space is taken
                        rotatable = false;
                    }
                }
            }
        }
        if (rotatable) {
            if (key === Key.Up) {
                this.tetromino.rotateLeft();
            } else {
                this.tetromino.rotateRight();
            }
        }
    };

    var game = new Game();
    game.init();

    var now = Date.now(),
        then = Date.now(),
        fpsInterval = 1000 / 2,
        elapsed;

    function animate() {
        window.requestAnimationFrame(animate);
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            game.loop();
        }
    }

    var Key = {
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40
    };

    document.addEventListener("keyup", function (event) {
        var keyCode = event.keyCode || event.which;
        if (keyCode === Key.Left) {
            game.move(Key.Left);
        } else if (keyCode === Key.Up) {
            game.rotate(Key.Up);
        } else if (keyCode === Key.Right) {
            game.move(Key.Right);
        } else if (keyCode === Key.Down) {
            game.rotate(Key.Down);
        }
    }, false);

    animate();
} ());
