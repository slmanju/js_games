  var canvas = document.getElementById("mycanvas");
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var scorecanvas = document.getElementById("scorecanvas");
  var scoreCtx = scorecanvas.getContext("2d");
  
  var Game = {
   score: 0,
    message: "Press space to start.",
   start: function() {
      Snake.init();
      this.draw();
      this.drawScore();
    },
    loop: function() {
      if (Snake.hitWall() || Snake.hitBody()) {
       this.collide();
      } else {
       Snake.eat();
       Snake.move();
        this.draw();
       this.drawScore();
      }
    },
    draw: function() {
     ctx.clearRect(0, 0, width, height);
     Apple.draw();
     Snake.draw();
    },
    collide: function() {
     clearInterval(refreshIntervalId);
      this.message = "game over!!! Score: " + this.score;
  this.drawScore();
},
drawScore: function() {
  scoreCtx.clearRect(0, 0, width, height);
 scoreCtx.font = "14px Arial";
 scoreCtx.fillText(this.message, 10, 20);
    }
  };
  
  var Point = function(x, y) {
   this.x = x;
    this.y = y;
  }
  
  var Apple = {
   x: 50,
    y: 50,
    draw: function() {
     ctx.fillStyle = "green";
      ctx.fillRect(Apple.x, Apple.y, 10, 10);
    },
    locate: function() {
     this.x = (Math.floor(Math.random() * 45)) * 10;
   this.y = (Math.floor(Math.random() * 25)) * 10;
    }
  };

  var Snake = {
   x: 0,
    y: 0,
    body: [],
    direction: 'right',
init: function() {
  for (i = 3; i > 0; i--) { 
      Snake.body.push(new Point(i * 10, 0));
  }
},
head: function() {
 return this.body[0];
},
draw: function() {
 for (i = 0; i < this.body.length; i++) {
   point = this.body[i];
    if (i === 0) {
     this.drawSquare(point.x, point.y, 10, "red");
} else {
 this.drawSquare(point.x, point.y, 10, "blue");
    }
  };
},
drawSquare: function(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = "#FFF";
  ctx.strokeRect(x, y, size, size);
},
move: function() {
 for (i = this.body.length - 1; i > 0; i--) {
   point = this.body[i];
    pointNext = this.body[i - 1];
    point.x = pointNext.x;
    point.y = pointNext.y;
  }
  head = this.body[0];
  if (this.direction === 'left') {
   head.x -= 10;
  } else if (this.direction === 'up') {
   head.y -= 10;
  } else if (this.direction === 'right') {
   head.x += 10;
  } else if (this.direction === 'down') {
   head.y += 10;
  }
},
hitWall: function() {
 head = this.head();
  var hit = false;
  if (head.x < 0 || head.x >= width 
    || head.y < 0 || head.y >= height) {
   hit = true;
  }
  return hit;
},
hitBody: function() {
 head = this.head();
  var hit = false;
  for (i = 1; i < this.body.length; i++) {
   headRect = new Rectangle(head.x, head.y, 10, 10);
    bodyPart = this.body[i];
    bodyRect = new Rectangle(bodyPart.x, bodyPart.y, 10, 10);
    if (headRect.intersects(bodyRect)) {
     hit = true;
    }
  }
  return hit;
},
eat: function() {
 head = this.head();
  if (head.x == Apple.x && head.y == Apple.y) {
    Snake.body.push(new Point(0, 0));
    Apple.locate();
    Game.score++;
    Game.message = "Score: " + Game.score;
      }
    }
  };
  
  function Rectangle(x, y, width, height) {
   this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  };
  Rectangle.prototype.intersects = function(rectangle) {
    return (this.x < rectangle.x + rectangle.width &&
      this.x + this.width > rectangle.x &&
        this.y < rectangle.y + rectangle.height &&
        this.y + this.height > rectangle.y);
  };
  
 Game.start();
  
   window.onkeyup = function(e) {
      var key = e.keyCode ? e.keyCode : e.which;
      if (key == 32) {
       refreshIntervalId = setInterval(loop, 300);
        Game.message = "Score: " + Game.score;
  } else if (key == 37) {
   Snake.direction = 'left';
  } else if (key == 38) {
   Snake.direction = 'up';
  } else if (key == 39) {
   Snake.direction = 'right';
  } else if (key == 40) {
   Snake.direction = 'down';
      }
   };
   function loop() {
    Game.loop();
   };