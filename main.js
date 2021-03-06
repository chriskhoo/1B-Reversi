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
    numberOfValidMoves: 1,
    validMovesArray: [
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
    player1Score: 2,
    player2Score: 2,
  };

  var workingCalVar = {
    flipCounter: 0,
    flipDecision: false,
    breakToken: false,
    sumOfFlipCounters: 0,
  };


  // game functions
  var gameFunctions = {

    boardClick: function() {
      console.log("/////////////////////////////////");
      gameFunctions.checkIfValidMove.apply(this);
      console.log("move valid: " + gameVariables.moveValid);
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
      } else {
        gameFunctions.nextPlayerPrompt();
      }
    },

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
        // get current div
        var tile = $('#board' + (Math.floor(i / 8)) + (i % 8));

        // if JS array says tile is player 1, assign class
        if (gameVariables.boardData[Math.floor(i / 8)][(i % 8)] === 1) {
          tile.attr("class", "tiles player1tile");
        }
        // if JS array says tile is player 2, assign class
        else if (gameVariables.boardData[Math.floor(i / 8)][(i % 8)] === -1) {
          tile.attr("class", "tiles player2tile");
        }
        // console log the blank tiles
        // else {
        //   console.log("tile" + Math.floor(i / 8) + (i % 8) + ": " + gameVariables.boardData[Math.floor(i / 8)][(i % 8)]);
        // }
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
      checksNFlips.checkAndSum(clickedRow, clickedColumn, currentValue);

      //if the move is invalid (occupied or no tiles to flip), prompt the player,
      console.log("run 1");
      if (gameVariables.boardData[clickedRow][clickedColumn]) {
        console.log("function move valid should be false");
        gameVariables.moveValid = false;
        sounds.playErrorS();
      }
      else {
        if (workingCalVar.sumOfFlipCounters > 0) {
          gameVariables.moveValid = true;
          //play sounds effects for move
          gameVariables.currentPlayer == 1 ? sounds.playP1moveS() : sounds.playP2moveS();
        } else {
          gameVariables.moveValid = false;
          sounds.playErrorS();
        }
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
      // reset scores
      gameVariables.player1Score = 0;
      gameVariables.player2Score = 0;
      for (i = 0; i < 64; i++) {
        if (gameVariables.boardData[Math.floor(i / 8)][(i % 8)] == 1) {
          gameVariables.player1Score++;
        }
        if (gameVariables.boardData[Math.floor(i / 8)][(i % 8)] == -1) {
          gameVariables.player2Score++;
        }
      }
      $('#p1Score').html(gameVariables.player1Score);
      $('#p2Score').html(gameVariables.player2Score);
    },

    nextPlayer: function() {
      // change current player
      gameVariables.currentPlayer = gameVariables.currentPlayer == 1 ? 2 : 1;
    },

    checkGameOver: function() {
      gameVariables.currentRound++;
      // check to see if there are any remaining moves
      if (gameVariables.currentRound === 62) {
        gameVariables.gameOver = true;
      }
      // check to see if empty squares are valid moves
      gameFunctions.updateValidMovesArray();
      gameFunctions.countNumberOfValidMoves();
      if (gameVariables.numberOfValidMoves <= 0) {
        gameVariables.gameOver = true;
      }

    },

    gameOverSequence: function() {
      if (gameVariables.player1Score == gameVariables.player2Score) {
        sounds.playDrawS();
        alert("It's a draw, there are no winners!");
      } else if (gameVariables.player1Score > gameVariables.player2Score) {
        sounds.playP1WinsS();
        alert('Player 1 wins!\nP1: ' + gameVariables.player1Score + '\nP2: ' + gameVariables.player2Score);
      } else {
        sounds.playP2WinsS();
        alert('Player 2 wins!\nP1: ' + gameVariables.player1Score + '\nP2: ' + gameVariables.player2Score);
      }
    },

    nextPlayerPrompt: function() {
      //if player 1's turn
      if (gameVariables.currentPlayer == 1) {
        // check to see if player 1 is inactive and remove inactive
        if ($("#p1Panel").hasClass("inactive") === true) {
          $("#p1Panel").toggleClass("inactive");
        }

        // check to see if player 2 is inactive, if not, add inactive to player 2 panel
        if ($("#p2Panel").hasClass("inactive") === false) {
          $("#p2Panel").toggleClass("inactive");
        }

      }
      //if player 2's turn
      else {
        // check to see if player 2 is inactive and remove inactive
        if ($("#p2Panel").hasClass("inactive") === true) {
          $("#p2Panel").toggleClass("inactive");
        }

        // check to see if player 1 is inactive, if not, add inactive to player 1 panel
        if ($("#p1Panel").hasClass("inactive") === false) {
          $("#p1Panel").toggleClass("inactive");
        }
      }
    },

    updateValidMovesArray: function() {
      // go through all elements to populate the array
      for (i = 0; i < 64; i++) {
        // reset working variable
        workingCalVar.sumOfFlipCounters = 0;
        // get coordinates for all squares
        var rowNum = Math.floor(i / 8);
        var columnNum = (i % 8);
        var currentValue = gameVariables.currentPlayer == 1 ? 1 : -1;
        checksNFlips.checkAndSum(rowNum, columnNum, currentValue);
        // if position on board is empty, store potential points in validMovesArray, if occupied store 0
        gameVariables.validMovesArray[rowNum][columnNum] = gameVariables.boardData[rowNum][columnNum] === 0 ? workingCalVar.sumOfFlipCounters : 0;

        // Add a class of valid player moves to the div
        // for p1
        if (gameVariables.currentPlayer == 1) {
          // remove old valid moves for p2
          if ($("#board" + rowNum + columnNum).hasClass("validP2Move") === true) {
            $("#board" + rowNum + columnNum).toggleClass("validP2Move");
          }
          // update new valid moves
          if (gameVariables.validMovesArray[rowNum][columnNum] !== 0) {
            $("#board" + rowNum + columnNum).toggleClass("validP1Move");
          }
        }
        // for p2
        else {
          // remove valid moves for p1
          if ($("#board" + rowNum + columnNum).hasClass("validP1Move") === true) {
            $("#board" + rowNum + columnNum).toggleClass("validP1Move");
          }
          // update new valid moves for p2
          if (gameVariables.validMovesArray[rowNum][columnNum] !== 0) {
            $("#board" + rowNum + columnNum).toggleClass("validP2Move");
          }
        }

      }
    },

    countNumberOfValidMoves: function() {
      // initialize variable
      gameVariables.numberOfValidMoves = 0;
      // count number of valid moves in the array
      for (i = 0; i < 64; i++) {
        if (gameVariables.validMovesArray[Math.floor(i / 8)][(i % 8)] > 0) {
          gameVariables.numberOfValidMoves++;
        }
      }
    }

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
      }
    },

    checkAndSum: function(clickedRow, clickedColumn, currentValue) {
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
    },

  };

  function init() {
    console.log('file initialized');
    gameVariables.boardData[3][3] = -1;
    gameVariables.boardData[3][4] = 1;
    gameVariables.boardData[4][3] = 1;
    gameVariables.boardData[4][4] = -1;

  }

  function main() {
    console.log('main section linked');
    gameFunctions.makeBoard();
    init();
    gameFunctions.redrawBoard();
    gameFunctions.updateScores();
    gameFunctions.checkGameOver();
    sounds.playBackgroundS();

  }

  var sounds = {
    playBackgroundS: function() {
      $('#backgroundS').prop('loop', true);
      $('#backgroundS').get(0).play();
    },

    playErrorS: function() {
      $('#errorS').get(0).pause();
      $('#errorS').get(0).currentTime = 0;
      $('#errorS').get(0).play();
    },

    playP1WinsS: function() {
      $('#p1WinsS').get(0).pause();
      $('#p1WinsS').get(0).currentTime = 0;
      $('#p1WinsS').get(0).play();
    },

    playP2WinsS: function() {
      $('#p2WinsS').get(0).pause();
      $('#p2WinsS').get(0).currentTime = 0;
      $('#p2WinsS').get(0).play();
    },

    playDrawS: function() {
      $('#drawS').get(0).pause();
      $('#drawS').get(0).currentTime = 0;
      $('#drawS').get(0).play();
    },

    playP1moveS: function() {
      $('#p1moveS').get(0).pause();
      $('#p1moveS').get(0).currentTime = 0;
      $('#p1moveS').get(0).play();
    },

    playP2moveS: function() {
      $('#p2moveS').get(0).pause();
      $('#p2moveS').get(0).currentTime = 0;
      $('#p2moveS').get(0).play();
    },

  };



  main();

});
