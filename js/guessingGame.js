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

Game.prototype.playersGuessSubmission = function(num) {
  if (num > 100 || num < 1 || isNaN(num)) throw 'That is an invalid guess.';
  this.playersGuess = num;
  return this.checkGuess(num);
};

Game.prototype.checkGuess = function(num) {
  if (num === this.winningNumber) return 'You Win!';
  else if (this.pastGuesses.includes(num)) return 'You have already guessed that number.';
  this.pastGuesses.push(num);
  if (this.pastGuesses.length >= 5) return 'You Lose.';
  else if (this.difference() < 10) return 'You\'re burning up!';
  else if (this.difference() < 25) return 'You\'re lukewarm.';
  else if (this.difference() < 50) return 'You\'re a bit chilly.';
  else return 'You\'re ice cold!';
};

Game.prototype.provideHint = function() {
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

// Game implementation //

$(document).ready(function() {
  var game = new Game(),
      $submitGuess = $('#guess'),
      $guess = $submitGuess.prev();

  function makeGuess() {
    console.log(game.playersGuessSubmission($guess.val()));
    $guess.val('');
  }

  $submitGuess.on('click', makeGuess);
  $guess.on('keyup', function(evt) {
    if (evt.which === 13) makeGuess();
  });
});
