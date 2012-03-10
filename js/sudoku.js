
// just for debug
var ui;

$(document).ready(function () {
    var puzzles;
    ui  = new Sudoku.UI();
    puzzles = new Sudoku.Puzzles();

    ui.Populate(puzzles.GetPuzzle('easy'));
    ui.ReadGrid();
    ui.SetupClickHandlers();
    ui.SetupHints();
    ui.UpdateHints();
});
