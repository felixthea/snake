(function (root) {
  var Game = root.Game = (root.Game || {});

  var Board = Game.Board = function () {
    this.buildBoard();
    this.snake = new Snake();
    this.score = 0;
    this.apple = new Apple(this);
    this.run();
  };

  _.extend(Board.prototype, {
    buildBoard: function () {
      var row, col;
      _(10).times(function() {
        row = $('<div></div>');

        _(10).times(function() {
          row.append($('<span></span>'));
        });

        $('#board').append(row);
      });
    },

    run: function() {
      var that = this;
      that.snake.render();

      var newHead = that.snake.getNewHead();
      if (!that.snake.collides(newHead)) {

        this.snake.addHead(newHead);
        if (that.apple.eaten(that.snake.head())){
          that.score += 10;
          $('#score').html(that.score);
        } else {
          that.snake.dropTail();
        }
        setTimeout (that.run.bind(that), 100);
      } else {
        alert("Game over!");
      }
    }
  });

  var Apple = Game.Apple = function (game) {
    this.game = game;
    this.position = this.getPosition();
  }

  _.extend( Apple.prototype, {
    getPosition: function() {
      $('span').removeClass('apple');
      var x, y;

      x = Math.floor(Math.random()*10) + 1;
      y = Math.floor(Math.random()*10) + 1;

      var that = this;
      if (this.game.snake.collides([x,y]))
        return this.getPosition();

      var apple = $('#board div:nth-child('+ x +') span:nth-child(' + y + ')');
      apple.addClass('apple');
      return [x-1,y-1];
    },

    eaten: function(head) {
      if (head[0] === this.position[0] && head[1] === this.position[1]) {
        this.position = this.getPosition();
        return true;
      }

      return false;
    }

  });


  var Snake = Game.Snake = function () {
    this.segments = [[0,2],[0,3],[0,4]];
    this.direction = [0,-1];
    this.addHandler();
  };

  _.extend( Snake.prototype, {

    addHandler: function() {
      var that = this;
      window.onkeypress = function(e) {
        var map = {
          '119': [-1,0],
          '97': [0,-1],
          '115': [1,0],
          '100': [0,1]
        };

        var dir = map[e.keyCode];
        console.log(dir);
        if (dir)
          that.changeDirection(dir);
      };
    },

    head: function() {
       return this.segments[0];
    },

    changeDirection: function(dir) {
      if (!this.validDirectionChange(dir)) {
        console.log("invalid direction change");
        return;
      }

      this.direction = dir;
    },

    validDirectionChange: function (dir) {
      if (this.direction[0] === 0 && dir[1] === 0) {
        return true;
      } else if (this.direction[1] === 0 && dir[0] === 0) {
        return true;
      } else {
        return false;
      }
    },

    dropTail: function(){
      this.segments.pop();
    },

    render: function(){
      var cells = $('#board div span')

      cells.removeClass('snake');

      _.each( this.segments, function( coord ) {
        x = coord[0] + 1;
        y = coord[1] + 1;

        segment = $('#board div:nth-child('+ x +') span:nth-child(' + y + ')');
        segment.addClass('snake');
      });
    },

    collides: function(coords) {
      var that = this;
      var x = coords[0];
      var y = coords[1];

      return _.some(that.segments, function(segment) {
        return (segment[0] === x && segment[1] === y);
      })
    },

    getNewHead: function() {
      var newX = (this.direction[0] + this.segments[0][0]) % 10;
      var newY = (this.direction[1] + this.segments[0][1]) % 10;

      if(newX < 0) {
        newX = 10 + newX;
      }

      if(newY < 0) {
        newY = 10 + newY;
      }

      return [ newX, newY ];
    },

    addHead: function(head){
      this.segments.unshift( head );
    },
  });

})(this);

// this.Hanoi.Game is a constructor function, so we instantiate a new object, then run it.
var that = this;
$(document).ready( function() {
  var Game = new that.Game.Board();
});

