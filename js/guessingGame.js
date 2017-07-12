function generateWinningNumber() {
  return Math.floor(Math.random() * 100 + 1);
}

function shuffle(arr) {
  var index, temp;
  for (var i = arr.length - 1; i; i--) {
    index = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[index];
    arr[index] = temp;
  }
  return arr;
}

function newGame() {
  return new Game();
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.winningNumber - this.playersGuess);
};

Game.prototype.isLower = function() {
  return this.playersGuess <  this.winningNumber;
};

Game.prototype.isOver = function() {
  return this.pastGuesses.length >= 5 || this.checkGuess();
};

Game.prototype.playersGuessSubmission = function(num) {
  if (num > 100 || num < 1 || isNaN(num)) throw 'That is an invalid guess.';
  this.playersGuess = parseInt(num, 10);
};

Game.prototype.checkGuess = function() {
  return this.playersGuess === this.winningNumber;
};

Game.prototype.provideHint = function() {
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

// Game implementation //

$(document).ready(function() {
  var game = newGame(),
      $title = $('#main_header h1'),
      $subtitle = $('#main_header h2'),
      $submitGuess = $('#guess'),
      $guess = $submitGuess.prev(),
      $pastGuesses = $('#guesses ul li'),
      $reset = $('#reset'),
      $hint = $('#hint'),
      hints = game.provideHint();

  function makeGuess() {
    var title = '', sub = 'Choose a number between 1 and 100!';
    if (game.isOver()) return false;
    game.playersGuessSubmission($guess.val());
    $guess.val('');
    if (game.checkGuess()) {
      $title.text('Congratulations! ' + game.winningNumber + ' was the right number!');
      $subtitle.text('Hit Reset to play again.');
      $submitGuess.prop('disabled', true);
      $hint.prop('disabled', true);
      return true;
    } else if (game.pastGuesses.includes(game.playersGuess)) {
      title = 'You have already guessed that number. Try again!';
    }

    $pastGuesses.eq(game.pastGuesses.length).text(game.playersGuess);
    game.pastGuesses.push(game.playersGuess);

    if (game.isOver()) {
      title = 'Oh no! You\'ve lost!';
      sub = 'Hit Reset to try again.';
      $submitGuess.prop('disabled', true);
      $hint.prop('disabled', true);
    } else {
      if (game.difference() < 10) {
        title = 'You\'re burning up!';
      } else if (game.difference() < 25) {
        title = 'You\'re lukewarm.';
      } else if (game.difference() < 50) {
        title = 'You\'re a bit chilly.';
      } else {
        title = 'You\'re ice cold!';
      }

      if (game.isLower()) {
        sub = 'Try a higher number.';
      } else {
        sub = 'Try a lower number.';
      }
    }

    $title.text(title);
    $subtitle.text(sub);
  }

  function resetGame() {
    game = newGame();
    $title.text('Care to Guess?');
    $subtitle.text('Choose a number between 1 and 100!');
    $pastGuesses.text('-');
    $submitGuess.prop('disabled', false);
    $hint.prop('disabled', false);
    hints = game.provideHint();
  }

  function showHint() {
    $title.text('The correct number is either ' + hints[0] + ', ' + hints[1] + ', or ' + hints[2]);
  }

  $submitGuess.on('click', makeGuess);
  $guess.on('keyup', function(evt) {
    if (evt.which === 13) makeGuess();
  });
  $reset.on('click', resetGame);
  $hint.on('click', showHint);
});
