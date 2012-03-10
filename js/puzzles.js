(function () {

    function Puzzles () {
        this.list = [];
        this.Init();
    }

    if (this.Sudoku === undefined) {
        this.Sudoku = {};
    }

    this.Sudoku.Puzzles = Puzzles;  

    /*
        Init loads our default selection of puzzles.
        
        @return none
    */
    Puzzles.prototype.Init = function () {
        this.AddPuzzle([7,0,1,5,9,0,0,4,0,
                        8,3,0,0,6,0,1,9,0,
                        0,9,2,0,0,0,0,0,0,
                        0,0,0,9,1,0,8,6,0,
                        0,0,8,6,0,4,5,0,0,
                        0,5,6,0,7,8,0,0,0,
                        0,0,0,0,0,0,7,3,0,
                        0,7,4,0,3,0,0,1,2,
                        0,2,0,0,4,9,6,0,5],'easy');

        this.AddPuzzle([0,3,4,0,1,0,0,6,0,
                        0,0,0,0,2,8,0,0,0,
                        1,8,9,6,0,0,3,0,0,
                        6,0,0,5,0,0,0,3,0,
                        3,0,1,2,0,7,5,0,8,
                        0,9,0,0,0,3,0,0,6,
                        0,0,5,0,0,6,4,8,1,
                        0,0,0,1,8,0,0,0,0,
                        0,1,0,0,5,0,6,7,0],'easy');

        this.AddPuzzle([0,3,6,1,0,0,5,0,0,
                        0,0,8,0,6,0,0,3,0,
                        0,2,0,8,0,0,0,0,0,
                        0,0,3,4,5,0,0,9,0,
                        0,9,0,0,0,0,0,1,0,
                        0,1,0,0,2,6,4,0,0,
                        0,0,0,0,0,9,0,7,0,
                        0,7,0,0,4,0,8,0,0,
                        0,0,1,0,0,8,6,2,0],'medium');

        this.AddPuzzle([0,0,1,8,0,0,0,0,7,
                        0,0,3,0,2,0,1,0,0,
                        2,7,5,0,9,0,8,0,0,
                        0,8,0,0,0,0,0,0,9,
                        0,1,0,0,7,0,0,3,0,
                        5,0,0,0,0,0,0,1,0,
                        0,0,4,0,3,0,9,8,1,
                        0,0,9,0,6,0,7,0,0,
                        1,0,0,0,0,9,6,0,0],'medium');

        this.AddPuzzle([0,0,7,8,0,0,0,0,9,
                        0,1,0,0,4,3,0,0,0,
                        8,0,0,0,0,0,0,4,0,
                        9,0,6,0,0,0,0,1,0,
                        0,0,2,7,0,6,4,0,0,
                        0,3,0,0,0,0,9,0,8,
                        0,7,0,0,0,0,0,0,5,
                        0,0,0,3,1,0,0,9,0,
                        2,0,0,0,0,4,6,0,0],'evil');
    };

    /*
        AddPuzzle will add a puzzle of a difficulty to the
        puzzle list.

        @param p {array} sudoku puzzle
        @param d {string} difficult of puzzle
        @return none
    */
    Puzzles.prototype.AddPuzzle = function (p,d) {
        this.list.push({ difficulty : d,
                         puzzle: p});
    };

    Puzzles.prototype.GetPuzzle = function (d) {
        var i;
        for (i=0;i<this.list.length;i=i+1) {
            if (this.list[i].difficulty === d) {
                return this.list[i].puzzle;
            }
        }
        return [];
    };

}());
