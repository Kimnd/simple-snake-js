//-----------------------------------------------------------------------
// Snake game
//
// Author: delimitry
//-----------------------------------------------------------------------
/*
TODO
   -structure snake
    point (x; y; color=(background))
      ->bead (inherit(x,y); color=function(beadColorPick))
        ->snake segment (x=function(head.lastX); y=function(head.lastY); inherit(beadColor))
        (to add to snake, use arrayName.unshift(colidingBead)https://www.w3schools.com/js/js_array_methods.asp)
   -make walls teleport
   -remove input checking
*/

//A location on the game board
function Point(x, y) {
  this.x = x;
  this.y = y;

  this.collideWith = function(x, y) {
    console.log("something is hit! x: " + this.x + " y: " + this.y + "\n");
    return this.x == x && this.y == y;
  }
}
////////////////////////////////////////////////////////////////////////
//prototype inheritence: https://javascript.info/prototype-inheritance
/*
let location = {
  x: x;
  y: y;
}

let bead = {
  __proto__: location;
  color: getBeadColor(bead.location);
}

let snakeBead = {
  __proto__: bead;
  newLocation: ????
}


function Point(x, y) {
  this.location = {x, y};
}

function Bead() {
  Point.call(this);
  this.color = BeadColorPick(this.location);
//  console.log("new bead: " + this.location);
}

function SnakeBead() {
  Bead.call(this);
  this.newLocation = this.SnakeBead[] + 1;//the new location of this bead is the 
}
*/
////////////////////////////////////////////////////////////////////////


var SnakeDirections = {
  UP : 0, 
  DOWN : 1,
  LEFT : 2,
  RIGHT : 3
}

function getRandomRange(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function Snake(canvas, context, point_size) {

  this.score = 0;
  this.game_over = false;
  this.game_win = false;
  this.game_paused = false;
  this.direction = SnakeDirections.RIGHT;
  this.point_size = point_size;
  this.body = new Array();
  this.food = new Point();

  this.init = function() {    
    this.score = 0;
    this.game_over = false;
    this.game_win = false;
    this.game_paused = false;
    this.direction = SnakeDirections.RIGHT;
    this.body = new Array();

    pos_x = Math.floor(getRandomRange(0, canvas.width / 2) / this.point_size) * this.point_size;
    pos_y = Math.floor(getRandomRange(0, canvas.height) / this.point_size) * this.point_size;
    // init snake body
    for (var i = 0; i < 3; i++) {
      this.body.push(new Point(pos_x, pos_y));
    };
    
    food_x = Math.floor(getRandomRange(0, canvas.width - this.point_size) / this.point_size) * this.point_size;
    food_y = Math.floor(getRandomRange(0, canvas.height - this.point_size) / this.point_size) * this.point_size;
    this.food = new Point(food_x, food_y);
  }


  this.draw = function() {
    for (var i = this.body.length-1; i >= 0; i--) {
      if (i == 0) context.fillStyle = '#8FC93A'; else context.fillStyle = 'rgb(255,0,0)';
      context.fillRect(this.body[i].x, this.body[i].y, this.point_size, this.point_size); 
    };

    context.fillStyle = '#E18335';
    context.fillRect(this.food.x, this.food.y, this.point_size, this.point_size); 

    if (this.game_over) {
      context.fillStyle = 'rgb(255,255,0)';
      context.font = 'bold 20px Arial';
      context.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2);
    }

    if (this.game_win) {
      context.fillStyle = 'rgb(255,255,0)';
      context.font = 'bold 20px Arial';
      context.fillText('You Win', canvas.width / 2 - 30, canvas.height / 2);
    }

    if (this.game_paused && !this.game_win && !this.game_over) {
      context.fillStyle = 'rgb(255,255,0)';
      context.font = 'bold 20px Arial';
      context.fillText('Pause', canvas.width / 2 - 30, canvas.height / 2);
    }

    context.fillStyle = 'rgb(255,255,0)';
    context.font = 'bold 15px Arial';
    context.fillText('Score: '+ this.score, 5, 15);
  }


  this.toggle_pause = function() {
    this.game_paused = !this.game_paused;
  }


  this.update_direction = function(direction) {
    if (this.direction == SnakeDirections.LEFT && direction == SnakeDirections.RIGHT) return;
    if (this.direction == SnakeDirections.RIGHT && direction == SnakeDirections.LEFT) return;
    if (this.direction == SnakeDirections.UP && direction == SnakeDirections.DOWN) return;
    if (this.direction == SnakeDirections.DOWN && direction == SnakeDirections.UP) return;
    this.direction = direction;
  }


  this.update = function() {
    if (this.game_over || this.game_win || this.game_paused) return;
    /*note: for the grid to match up, step must be the same as gameResolution in game.html*/
    step = 10;
    switch (this.direction) {
      case SnakeDirections.LEFT:
        if (this.body[0].x > 0) {
          this.body.unshift(new Point(this.body[0].x - step, this.body[0].y));
          this.body.pop();
        } else { 
          this.body[0].x = 0;
          this.game_over = true;
        }
        break;
      case SnakeDirections.UP:
        if (this.body[0].y > 0) {           
          this.body.unshift(new Point(this.body[0].x, this.body[0].y - step));    
          this.body.pop();
        } else { 
          this.body[0].y = 0; 
          this.game_over = true;
        }
        break;

      case SnakeDirections.RIGHT:
        if (this.body[0].x < canvas.width - this.point_size) {
          this.body.unshift(new Point(this.body[0].x + step, this.body[0].y));    
          this.body.pop();          
        } else {
          this.body[0].x = canvas.width - this.point_size;
          this.game_over = true;
        } 
        break;

      case SnakeDirections.DOWN:
        if (this.body[0].y < canvas.height - this.point_size) { 
          this.body.unshift(new Point(this.body[0].x, this.body[0].y + step));    
          this.body.pop();
        } else { 
          this.body[0].y = canvas.height - this.point_size; 
          this.game_over = true;
        }
        break;    
    }

    // check for self collision
/*
    if (this.body.length > 1) {
      for (var i = 1; i < this.body.length; i++) {      
        if (this.body[0].collideWith(this.body[i].x, this.body[i].y)) {
          this.game_over = true;
        }
      }
    }
*/
    if (this.body[0].collideWith(this.food.x, this.food.y)) {
      food_x = Math.floor(getRandomRange(0, canvas.width - this.point_size) / this.point_size) * this.point_size;
      food_y = Math.floor(getRandomRange(0, canvas.height - this.point_size) / this.point_size) * this.point_size;
      this.food = new Point(food_x, food_y);
      this.body.push(new Point(food_x, food_y));
      this.score += 10;
      if (this.score > 250) {
        this.game_win = true;
      }
    }
  }

}
