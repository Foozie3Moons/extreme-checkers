$(document).ready(function() {

  $(".red-pawn, .red-King").draggable("disable");

  $(".gamepiece").draggable({
    cursor: "move",
    containment: ".tdbody",
    scroll: false,
    revert: true,
    stop: function(event, ui) {
      if (!$(ui.helper).draggable("option", "revert")) {
      }
      $(ui.helper).draggable("option", "revert", true);
    }
  });

  $(game.playableSquares).droppable({
    over: function(event, ui) {
      if (game.currentMove.currentPiece.hasClass("pawn")) {
        var validMoves = game.currentMove.validMoves.pawn;
        var validJumps = game.currentMove.validJumps.pawn;
      } else if (game.currentMove.currentPiece.hasClass("king")) {
        var validMoves = game.currentMove.validMoves.king;
        var validJumps = game.currentMove.validJumps.king;
      }

      var target = game.currentMove.target;
      target = {col: $(this).data("col"), row: $(this).data("row"), letter: $(this).data("letter")}
      game.currentMove.targetCell = $(this);
      game.currentMove.validMove = validMove(validMoves, target);
      game.currentMove.validJump = validJump(validJumps, target);
      // console.log("over something");
    },
    drop: function(event,ui) {
      $this = $(this);

      if ($this.find(".gamepiece").length > 0) {
        // console.log("nope!");
        return false;
      } else if (game.currentMove.validMove || game.currentMove.validJump) {
        ui.draggable.draggable("option", "revert", false);
        var $this = $(this);

        // $this.addClass("ui-state-highlight");

        $this.append(ui.draggable);

        var width = $this.width();
        var height = $this.height();

        var cntrLeft = width / 2 - ui.draggable.width() / 2;// + left;
        var cntrTop = height / 2 - ui.draggable.height() / 2;// + top;

        ui.draggable.css({
            left: cntrLeft + "px",
            top: cntrTop + "px",
            "z-index": 0
        });
      } else {

      }
    }
  });

  $(game.gamepieces).on("dragstart", function(e) {
    $(this).css({
      "z-index": 1
    });
    if (game.currentMove.moved) {

    } else if ($(this).hasClass(game.player + "-gamepiece")) {
      game.currentMove.currentPiece = $(this);
      game.currentMove.initial = $(this).parent();
      getValidMoves();
      //$(this).detach();
    }
  });

  $(game.playableSquares).on("dragstop", function() {
    if (game.currentMove.validMove || game.currentMove.validJump) {
      updateGamePieceDataTo(this);
      if (game.currentMove.validJump) {
        game.currentMove.jumpedPiece.hide("explode", 1000);
      }
      if (game.currentMove.moved) {
        if (game.currentMove.jumped) {
          if (additionalJumps()) {
            // DO NOTHING
          } else {
            console.log("jumped from " + [game.currentMove.initial.data("letter"), game.currentMove.initial.data("row")] + " to " + [game.currentMove.target.data("letter"), game.currentMOve.data("row")]);
            switchTurn();
          }
        } else {
          var initial = $(game.currentMove.initial);
          var target = $(game.currentMove.targetCell);
          console.log("moved from " + [initial.data("letter"), initial.data("row")] + " to " + [target.data("letter"), target.data("row")]);
          switchTurn();
        }
      }
    } else {
      try {
        resetCurrentMoveValues();
      } catch(err) {
        console.log("Not a valid play area");
      }
    }
  });

});