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
        var $newTile = $('<div class="tiles" id="board' + (Math.floor(i / 8)) + (i % 8) + '">');
        // append tiles to board
        $('#rowContainer' + (Math.floor(i / 8))).append($newTile);
      }
    },

    redrawBoard: function() {
      // redraw the board following updates
      for (i = 0; i < 64; i++) {
        var tile = $('#board' + (Math.floor(i / 8)) + (i % 8));

        if (gameVariables.boardData[Math.floor(i / 8)][(i % 8)] === 1) {
          console.log("tile" + Math.floor(i / 8) + (i % 8) + ": p1");
          tile.attr("class", "tiles player1tile");
        } else if (gameVariables.boardData[Math.floor(i / 8)][(i % 8)] === -1) {
          console.log("tile" + Math.floor(i / 8) + (i % 8) + ": p2");
          tile.attr("class", "tiles player2tile");
        } else {
          console.log("tile" + Math.floor(i / 8) + (i % 8) + ": " + gameVariables.boardData[Math.floor(i / 8)][(i % 8)]);
        }
      }

    }

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
