$(document).ready(function() {
  console.log('JS linked');

  // game variables
  var gameVariables = {

    boardData: [
      // 0 is empty, 1 is player 1, -1 is player 2
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],

    currentPlayer: 1,
    moveValid: true,
    gameOver: false,
    currentRound: 1,

  };

  var workingCalVar = {
    flipCounter: 0,
    flipDecision: false,
    breakToken: false,
    sumOfFlipCounters: 0,
  };


  // game functions
  var gameFunctions = {
    // construct tiles
    makeBoard: function() {
      // create 8 row containers
      for (i = 0; i < 8; i++) {
        var $newRow = $('<div class="rowContainers" id="rowContainer' + i + '">');
        // append tiles to board
        $('#gameGrid').append($newRow);
      }
      // fill the 8 row containers with 8 columns each
      for (i = 0; i < 64; i++) {
        // create tiles
        var $newTile = $('<div class="tiles" id="board' + (Math.floor(i / 8)) + (i % 8) + '">');
        // add event listeners to to the tiles
        $newTile.on("click", this.boardClick);
        // append tiles to board
        $('#rowContainer' + (Math.floor(i / 8))).append($newTile);
      }
    },

    redrawBoard: function() {
      // redraw the board following updates
      for (i = 0; i < 64; i++) {
        var tile = $('#board' + (Math.floor(i / 8)) + (i % 8));

        if (gameVariables.boardData[Math.floor(i / 8)][(i % 8)] === 1) {
          // console.log("tile" + Math.floor(i / 8) + (i % 8) + ": p1");
          tile.attr("class", "tiles player1tile");
        } else if (gameVariables.boardData[Math.floor(i / 8)][(i % 8)] === -1) {
          // console.log("tile" + Math.floor(i / 8) + (i % 8) + ": p2");
          tile.attr("class", "tiles player2tile");
        }
        // else {
        //   console.log("tile" + Math.floor(i / 8) + (i % 8) + ": " + gameVariables.boardData[Math.floor(i / 8)][(i % 8)]);
        // }
      }
    },

    boardClick: function() {
      console.log("click" + this.id);
      console.log("/////////////////////////////////");
      gameFunctions.checkIfValidMove.apply(this);
      if (gameVariables.moveValid) {
        gameFunctions.inputClick.apply(this);
        gameFunctions.computeMove.apply(this);
        gameFunctions.redrawBoard();
        gameFunctions.updateScores();
        gameFunctions.nextPlayer();
        gameFunctions.checkGameOver();
      }
      if (gameVariables.gameOver) {
        gameFunctions.gameOverSequence();
      }
    },

    inputClick: function() {
      // update js array on click (ternary)
      gameVariables.boardData[this.id[5]][this.id[6]] = gameVariables.currentPlayer == 1 ? 1 : -1;
    },

    checkIfValidMove: function() {
      //return moveValid = true if valid , return moveValid = false if not

      //initialize working variables
      workingCalVar.sumOfFlipCounters = 0;

      var clickedRow = Number(this.id[5]);
      var clickedColumn = Number(this.id[6]);
      var currentValue = gameVariables.currentPlayer == 1 ? 1 : -1;

      //run checks then sum the working variables to sumOfFlipCounters before the next check resets it
      checksNFlips.checkRight(clickedRow, clickedColumn, currentValue);
      checksNFlips.summingTilesFlipped();
      checksNFlips.checkLeft(clickedRow, clickedColumn, currentValue);
      checksNFlips.summingTilesFlipped();
      checksNFlips.checkUp(clickedRow, clickedColumn, currentValue);
      checksNFlips.summingTilesFlipped();
      checksNFlips.checkDown(clickedRow, clickedColumn, currentValue);
      checksNFlips.summingTilesFlipped();
      checksNFlips.checkDiagonalUR(clickedRow, clickedColumn, currentValue);
      checksNFlips.summingTilesFlipped();
      checksNFlips.checkDiagonalUL(clickedRow, clickedColumn, currentValue);
      checksNFlips.summingTilesFlipped();
      checksNFlips.checkDiagonalDR(clickedRow, clickedColumn, currentValue);
      checksNFlips.summingTilesFlipped();
      checksNFlips.checkDiagonalDL(clickedRow, clickedColumn, currentValue);
      checksNFlips.summingTilesFlipped();

      //if the move is invalid, prompt the player
      if(workingCalVar.sumOfFlipCounters > 0){
        gameVariables.moveValid = true;
      }
      else{
        gameVariables.moveValid = false;
        alert("Invalid move");
      }
    },

    computeMove: function() {
      var clickedRow = Number(this.id[5]);
      var clickedColumn = Number(this.id[6]);
      var currentValue = gameVariables.boardData[clickedRow][clickedColumn];

      //return moveValid = true if valid , return moveValid = false if not
      checksNFlips.checkRight(clickedRow, clickedColumn, currentValue);
      checksNFlips.computeRight(clickedRow, clickedColumn);
      checksNFlips.checkLeft(clickedRow, clickedColumn, currentValue);
      checksNFlips.computeLeft(clickedRow, clickedColumn);
      checksNFlips.checkUp(clickedRow, clickedColumn, currentValue);
      checksNFlips.computeUp(clickedRow, clickedColumn);
      checksNFlips.checkDown(clickedRow, clickedColumn, currentValue);
      checksNFlips.computeDown(clickedRow, clickedColumn);
      checksNFlips.checkDiagonalUR(clickedRow, clickedColumn, currentValue);
      checksNFlips.computeDiagonalUR(clickedRow, clickedColumn);
      checksNFlips.checkDiagonalUL(clickedRow, clickedColumn, currentValue);
      checksNFlips.computeDiagonalUL(clickedRow, clickedColumn);
      checksNFlips.checkDiagonalDR(clickedRow, clickedColumn, currentValue);
      checksNFlips.computeDiagonalDR(clickedRow, clickedColumn);
      checksNFlips.checkDiagonalDL(clickedRow, clickedColumn, currentValue);
      checksNFlips.computeDiagonalDL(clickedRow, clickedColumn);
    },

    updateScores: function() {
      console.log("update scores");
      // use for each loops and total player scores to define this
    },

    nextPlayer: function() {
      // change current player
      gameVariables.currentPlayer = gameVariables.currentPlayer == 1 ? 2 : 1;
    },

    checkGameOver: function() {
      gameVariables.currentRound++;
      if (gameVariables.currentRound === 61) {
        gameVariables.gameOver = true;
      }
      // check to see if there are any remaining valid moves
    },

    gameOverSequence: function() {
      alert("Game is over");
      //display who won and the scores
    },


  };

  var checksNFlips = {
    checkRight: function(clickedRow, clickedColumn, currentValue) {
      this.resetWorkingCalVars();
      // number of squares till edge of board
      var chkLimit = 8 - clickedColumn;

      for (var i = 1; i < chkLimit; i++) {
        // check right
        var chkRow = clickedRow;
        var chkCol = clickedColumn + i;
        this.checksquares(chkRow, chkCol, i, currentValue);
        if (workingCalVar.breakToken) {
          break;
        }
      }
    },

    computeRight: function(clickedRow, clickedColumn) {
      if (workingCalVar.flipDecision && workingCalVar.flipCounter > 0) {
        for (i = 1; i <= workingCalVar.flipCounter; i++) {
          var flpRow = clickedRow;
          var flpCol = clickedColumn + i;
          gameVariables.boardData[flpRow][flpCol] *= -1;
        }
      }
    },

    checkLeft: function(clickedRow, clickedColumn, currentValue) {
      this.resetWorkingCalVars();
      var chkLimit = clickedColumn + 1;

      for (var i = 1; i < chkLimit; i++) {
        var chkRow = clickedRow;
        var chkCol = clickedColumn - i;
        this.checksquares(chkRow, chkCol, i, currentValue);
        if (workingCalVar.breakToken) {
          break;
        }
      }
    },

    computeLeft: function(clickedRow, clickedColumn) {
      if (workingCalVar.flipDecision && workingCalVar.flipCounter > 0) {
        for (i = 1; i <= workingCalVar.flipCounter; i++) {
          var flpRow = clickedRow;
          var flpCol = clickedColumn - i;
          gameVariables.boardData[flpRow][flpCol] *= -1;
        }
      }
    },

    checkUp: function(clickedRow, clickedColumn, currentValue) {
      this.resetWorkingCalVars();
      var chkLimit = 8 - clickedRow;

      for (var i = 1; i < chkLimit; i++) {
        var chkRow = clickedRow + i;
        var chkCol = clickedColumn;
        this.checksquares(chkRow, chkCol, i, currentValue);
        if (workingCalVar.breakToken) {
          break;
        }
      }
    },

    computeUp: function(clickedRow, clickedColumn) {
      if (workingCalVar.flipDecision && workingCalVar.flipCounter > 0) {
        for (i = 1; i <= workingCalVar.flipCounter; i++) {
          var flpRow = clickedRow + i;
          var flpCol = clickedColumn;
          gameVariables.boardData[flpRow][flpCol] *= -1;
        }
      }
    },

    checkDown: function(clickedRow, clickedColumn, currentValue) {
      this.resetWorkingCalVars();
      var chkLimit = clickedRow + 1;

      for (var i = 1; i < chkLimit; i++) {
        var chkRow = clickedRow - i;
        var chkCol = clickedColumn;
        this.checksquares(chkRow, chkCol, i, currentValue);
        if (workingCalVar.breakToken) {
          break;
        }
      }
    },

    computeDown: function(clickedRow, clickedColumn) {
      if (workingCalVar.flipDecision && workingCalVar.flipCounter > 0) {
        for (i = 1; i <= workingCalVar.flipCounter; i++) {
          var flpRow = clickedRow - i;
          var flpCol = clickedColumn;
          gameVariables.boardData[flpRow][flpCol] *= -1;
        }
      }
    },

    checkDiagonalUR: function(clickedRow, clickedColumn, currentValue) {
      this.resetWorkingCalVars();
      var chkLimit = Math.min(8 - clickedRow, 8 - clickedColumn);

      for (var i = 1; i < chkLimit; i++) {
        var chkRow = clickedRow + i;
        var chkCol = clickedColumn + i;
        this.checksquares(chkRow, chkCol, i, currentValue);
        if (workingCalVar.breakToken) {
          break;
        }
      }
    },

    computeDiagonalUR: function(clickedRow, clickedColumn) {
      if (workingCalVar.flipDecision && workingCalVar.flipCounter > 0) {
        for (i = 1; i <= workingCalVar.flipCounter; i++) {
          var flpRow = clickedRow + i;
          var flpCol = clickedColumn + i;
          gameVariables.boardData[flpRow][flpCol] *= -1;
        }
      }
    },

    checkDiagonalUL: function(clickedRow, clickedColumn, currentValue) {
      this.resetWorkingCalVars();
      var chkLimit = Math.min(8 - clickedRow, clickedColumn + 1);

      for (var i = 1; i < chkLimit; i++) {
        var chkRow = clickedRow + i;
        var chkCol = clickedColumn - i;
        this.checksquares(chkRow, chkCol, i, currentValue);
        if (workingCalVar.breakToken) {
          break;
        }
      }
    },

    computeDiagonalUL: function(clickedRow, clickedColumn) {
      if (workingCalVar.flipDecision && workingCalVar.flipCounter > 0) {
        for (i = 1; i <= workingCalVar.flipCounter; i++) {
          var flpRow = clickedRow + i;
          var flpCol = clickedColumn - i;
          gameVariables.boardData[flpRow][flpCol] *= -1;
        }
      }
    },

    checkDiagonalDR: function(clickedRow, clickedColumn, currentValue) {
      this.resetWorkingCalVars();
      var chkLimit = Math.min(clickedRow + 1, 8 - clickedColumn);

      for (var i = 1; i < chkLimit; i++) {
        var chkRow = clickedRow - i;
        var chkCol = clickedColumn + i;
        this.checksquares(chkRow, chkCol, i, currentValue);
        if (workingCalVar.breakToken) {
          break;
        }
      }
    },

    computeDiagonalDR: function(clickedRow, clickedColumn) {
      if (workingCalVar.flipDecision && workingCalVar.flipCounter > 0) {
        for (i = 1; i <= workingCalVar.flipCounter; i++) {
          var flpRow = clickedRow - i;
          var flpCol = clickedColumn + i;
          gameVariables.boardData[flpRow][flpCol] *= -1;
        }
      }
    },

    checkDiagonalDL: function(clickedRow, clickedColumn, currentValue) {
      this.resetWorkingCalVars();
      var chkLimit = Math.min(clickedRow + 1, clickedColumn + 1);

      for (var i = 1; i < chkLimit; i++) {
        var chkRow = clickedRow - i;
        var chkCol = clickedColumn - i;
        this.checksquares(chkRow, chkCol, i, currentValue);
        if (workingCalVar.breakToken) {
          break;
        }
      }
    },

    computeDiagonalDL: function(clickedRow, clickedColumn) {
      if (workingCalVar.flipDecision && workingCalVar.flipCounter > 0) {
        for (i = 1; i <= workingCalVar.flipCounter; i++) {
          var flpRow = clickedRow - i;
          var flpCol = clickedColumn - i;
          gameVariables.boardData[flpRow][flpCol] *= -1;
        }
      }
    },


    resetWorkingCalVars: function() {
      workingCalVar.flipCounter = 0;
      workingCalVar.flipDecision = false;
      workingCalVar.breakToken = false;
    },

    checksquares: function(chkRow, chkCol, i, currentValue) {
      // empty squares exit loop with no flip
      if (gameVariables.boardData[chkRow][chkCol] === 0) {
        workingCalVar.flipDecision = false;
        workingCalVar.breakToken = true;
      }
      // same squares exit loop with flip
      else if (gameVariables.boardData[chkRow][chkCol] === currentValue) {
        // exit loop and start flipping
        workingCalVar.flipDecision = true;
        workingCalVar.breakToken = true;

      }
      // diff squares continue looking
      else if (gameVariables.boardData[chkRow][chkCol] === (currentValue * -1)) {
        // carry on checking
        workingCalVar.flipDecision = false;
        workingCalVar.flipCounter++;
      } else {
        console.log("check for bug");
      }
    },

    summingTilesFlipped: function() {
      if (workingCalVar.flipDecision && workingCalVar.flipCounter > 0) {
      workingCalVar.sumOfFlipCounters += workingCalVar.flipCounter;
    }},

  };

  function init() {
    console.log('file initialized');
    gameVariables.boardData[3][3] = 1;
    gameVariables.boardData[3][4] = -1;
    gameVariables.boardData[4][3] = -1;
    gameVariables.boardData[4][4] = 1;

  }

  function main() {
    console.log('main section linked');
    gameFunctions.makeBoard();
    init();
    gameFunctions.redrawBoard();

  }


  main();

});
