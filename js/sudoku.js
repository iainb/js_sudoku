(function () {
    function Sudoku() {
        this.gridsize = 9;
        
    }
    
    if (this.Sudoku === undefined) {
        this.Sudoku = {};
    }

    this.Sudoku.Solver = Sudoku;

    /*
        Solve is the entry point, it will either return a completed
        grid or throw an error.

        @param a {array} sudoku grid
        @return {array} completed sudoku 
    */
    Sudoku.prototype.Solve = function (a) {
        a = [].concat(a);
        a = this.TrySolve(a,0);

        if (!this.IsSolved(a)) {
            throw new Error('unable to solve grid');
        }
        return a;
    };

    /*
        TrySolve recursively attempts to solve the sudoku grid.

        First simple moves are completed until either the puzzle is solved or 
        more complex rules could be used. However, instead of using more complex
        rules this solver makes recursive guesses. Picking the branches with the fewest options.
        
        Eventually it will work out that a particular branch either yeilds the answer or it
        is impossible to continue. 

        @param a {array} sudoku grid
        @param count {number} current stack level
        @returns {array} possibly complete sudoku grid.
    */
    Sudoku.prototype.TrySolve = function (a,count) {
        var i, p, j, made_change, b, best;

        // count is used to work out the current level of recusion
        count = count + 1;

        // copy a - don't modify passed in array.
        a = [].concat(a);
        while(!this.IsSolved(a)) {
            made_change = false;
            best = { possible: [1,2,3,4,5,6,7,8,9], index : 0 };
            for (i=0;i<a.length;i=i+1) {
                if (a[i] === 0) {
                    // unsolved square
                    p = this.Possible(a,i);

                    if (p.length === 0) {
                        // dead end.
                        return a;
                    }
                
                    // make a change
                    if (p.length === 1) {
                        a[i] = p[0];
                        made_change = true;
                    } else {
                        // store p if its better than the current best
                        if (p.length < best.possible.length) {
                            best.possible = p;
                            best.index = i;
                        }
                    }
                } 
            }

            if (made_change === false) {
                // make a guess
                for (j=0;j<best.possible.length;j=j+1) {
                    a[best.index] = best.possible[j]; 
                    b = this.TrySolve(a,count);
                    if (this.IsSolved(b)) {
                        return b;
                    } 
                } 
                return a; 
            }
        }
        return a;
    };

    /*
        IsSolved will return true if a grid is completely solved
        or false if it is not.

        @param a {array} sudoku grid
        @reutnr {bool} 
    */
    Sudoku.prototype.IsSolved = function (a) {
        var i;
        for (i=0;i<a.length;i=i+1) {
            if (a[i] === 0) {
                return false;
            }
        }
        return true;
    };

    /*
        Possible takes a grid and location, it returns an array
        containing the possible numbers which could be located 
        in this possible.

        If the position has already been completed an error will be raised.

        @param a {array} sudoku grid
        @param j {number} positiion within the grid
        @return {array} possible numbers at this position.
    */
    Sudoku.prototype.Possible = function (a,j) {
        var row,col,squ, i, possible, r;

        if (a[j] !== 0) {
            throw new Error('Possible called on already completed grid position');
        }

        row = this.FetchRow(a,j);
        col = this.FetchColumn(a,j);
        squ = this.FetchSquare(a,j);

        possible = {};

        for (i=1;i<=9;i=i+1) {
            possible[i] = true;     
        } 

        for (i=0;i<row.length;i=i+1) {
            if (row[i] !== 0) {
                possible[row[i]] = false;
            }
        }

        for (i=0;i<col.length;i=i+1) {
            if (col[i] !== 0) {
                possible[col[i]] = false;
            }
        }

        for (i=0;i<squ.length;i=i+1) {
            if (squ[i] !== 0) {
                possible[squ[i]] = false;
            }
        }
        
        r = [];
        for (i=1;i<=9;i=i+1) {
            if (possible[i] === true) {
                r.push(i);
            } 
        }
        return r;
    };
    
    /*
        FetchRow given a positing within a grid
        return the row which it is within

        @param a {array} array representing the grid
        @param j {number} index into the array
        @return {array} array containing the row which j is within
    */
    Sudoku.prototype.FetchRow = function (a,j) {
        var i,r,start,end;
        r = [];

        start = j - (j % this.gridsize);
        end   = start + this.gridsize;

        for (i=start;i<end;i=i+1) {
            r.push(a[i]);
        }    
        return r; 
    };

    /*
        FetchColumn given a position within a grid
        return the column which it is within.

        @param a {array} array representing the grid
        @param j {number} index into the array
        @return {array} array containing the column which j is within
    */
    Sudoku.prototype.FetchColumn = function (a,j) {
        var i,r,start;
        r = [];
        start = (j % this.gridsize);
        for (i=start;i<a.length;i=i+this.gridsize) {
            r.push(a[i]);
        }
        return r; 
    };

   
    /*
        FetchSquare given a position within a grid
        return the square which it is within.

        @param a {array} array representing the grid
        @param j {number} index into the array
        @return {array} array containing the square which j is within
    */
    Sudoku.prototype.FetchSquare = function (a,j) {
        var r,diff;
       
        j = j - (j% this.gridsize) % (this.gridsize /3); 
        diff = (j % (this.gridsize * 3));
        if (diff >= 9 && diff <=15) {
            j = j - 9;
        }

        if (diff >=18) {
            j = j - 18;
        }
        r = [].concat(a.slice(j,j+3),a.slice(j+9,j+12),a.slice(j+18,j+21));
        return r;
    }; 

    /*
        Print takes a grid and 'pretty' prints it into a string
        
        @param a {array} sudoku grid
        @return {string} pretty printed representation of the grid
    */
    Sudoku.prototype.Print = function (a) {
        var i,s;
        s = '';
        for (i=0;i<a.length;i=i+1) {
            s = s + a[i];

            if ((i+1) % 3 === 0) {
                s = s + '|';
            }

            if ((i+1) % 9 === 0) {
                s = s + '\n';
            }

            if ((i+1) % 27 === 0) {
                s = s + '------------\n';
            }
        }
        return s;
    };
        
}());

(function () {
    
    function UI () {

        this.solver = new Sudoku.Solver();
        this.puzzles = new Sudoku.Puzzles();

        this.initial = [];
        this.solved  = [];

        this.displayhints = true;

    }

    if (this.Sudoku === undefined) {
        this.Sudoku = {};
    }

    this.Sudoku.UI = UI;    

    /*
        Populate populates the html grid with a partially completed
        sudoko grid

        @param a {array} sudoku grid
        @return none
    */
    UI.prototype.Populate = function (a) {
        var i;
        for (i=0;i<a.length;i=i+1) {
            if (a[i] === 0) {
                $('td #' + i).html('<input maxlength="1" size="1"/>');
                $('td #' + i).addClass('input');
                $('td #' + i).addClass('value');
                $('td #' + i).addClass('cell');
            } else {
                $('td #' + i).text(a[i]);
                $('td #' + i).addClass('value');
                $('td #' + i).addClass('cell');
            }
        }    

        try {
            this.solved = this.solver.Solve(a);
            this.initial = a;
        } catch (e1) {
            alert('unable to solve puzzle');
        }
        
    };
   
    /*
        ReadGrid parses the html grid and returns an array
        representing it.

        @return {array} sudoku grid as array
    */ 
    UI.prototype.ReadGrid = function () {
        var i,a,val;
        a = [];
        for(i=0;i<81;i=i+1) {
            val = parseInt($('td #' + i).text(),10);
            if (isNaN(val)) {
                val = parseInt($('td #' + i + ' input').val(),10);
                if (isNaN(val)) {
                    val = 0;
                }
            }
            a.push(val);
        }
        return a;
    };


    /*
        FindMistakes compares all user input with a completed version of the puzzle
        an array containing objects describing the mistakes is returned.
        
        an array of zero length means that no mistakes were found.
        
        @return {array} containing mistake objects
    */
    UI.prototype.FindMistakes = function () {
        var cur,i, mistakes;

        mistakes = [];
        cur = this.ReadGrid();
        for (i=0;i<cur.length;i=i+1) {
            if (cur[i] !== 0) {
                if (cur[i] !== this.solved[i]) {
                    mistakes.push({ position: i,
                                    current : cur[i],
                                    solved  : this.solved[i] });
                }
            }
        }
        return mistakes;
    };

    /*
        FindPossibles finds all possible numbers which could be displayed
        for an uncompleted cell. 

        A completed cell will contain a 0 length array.

        If the user has made mistakes, these will be reflected in the output

        @return {array} with an array containing all possibilities at all positions
    */
    UI.prototype.FindPossibles = function () {
        var cur, i, possibles, p;
        
        possibles = [];
        cur = this.ReadGrid();
        for (i=0;i<cur.length;i=i+1) {
            if (cur[i] === 0) {
                p = this.solver.Possible(cur,i);
                possibles.push(p);
            } else {
                possibles.push([]);
            }
        }
        return possibles; 
    };


    /*
        Find remaining returns the number of remaining squares until the 
        grid has been completed

        @returns {number} number of remaining squares to complete
    */
    UI.prototype.FindRemaining = function () {
        var i, cur, remaining;
        cur = this.ReadGrid();
        remaining = 0;
        for (i=0;i<cur.length;i=i+1) {
            if (cur[i] === 0) {
                remaining = remaining + 1;
            }
        }
        return remaining;
    };

    /*
        SetupClickHandlers sets up the basic click handlers
        to make the sudoku grid interactive

        @return none
    */
    UI.prototype.SetupClickHandlers = function () {
        var self;

        self = this;

        $('#status').click(function () {
            var msg;
            msg = 'There are ' + self.FindRemaining() + ' remaining\n';
            msg = msg + ' you have made ' + self.FindMistakes().length + ' mistakes so far';
            alert(msg);
        });
        
        $('#hints').click(function () {
            console.log(this);
        });

        $('#enablehints').button('toggle');

        $('input').keyup(function() {
            self.HandleInput($(this).val(),$(this).parent().attr('id'));
        });
    };

    /*
        SetupHints sets up the hints needed for when displayhints
        is enabled.

        @return none
    */
    UI.prototype.SetupHints = function () {
        var i;
        for(i=0;i<81;i=i+1) {
            $('#' + i).tooltip({placement: 'right',
                                title: '',
                                trigger : 'hover',
                                delay: { show: 3000, hide: 10}});        
        }
    };

    /*
        UpdateHints updates all of the tooltip hints if
        hints (this.displayhints) are enabled. Otherwise they
        will be disabled.

        @return none
    */
    UI.prototype.UpdateHints = function () {
        var possibles,i,self,doit;

        possibles = this.FindPossibles();

        for (i=0;i<possibles.length;i=i+1) {
            if (possibles[i].length !== 0 && this.displayhints === true) {
                $('#' + i).attr('title',possibles[i].join(','));
                $('#' + i).tooltip('fixTitle');
                $('#' + i).tooltip('enable');
            } else {
                $('#' + i).tooltip('disable');
            }
        }
    };

    /*
        Validate input and update display
        @param value {string} update value
        @param loc {int} position in array
        @return none
    */
    UI.prototype.HandleInput = function (value,loc) {
        value = parseInt(value,10); 
        if (isNaN(value) === true) {
            $('td #' + loc + ' input').val('');
        } else {
            if (value === 0) {
                $('td #' + loc + ' input').val('');
            } else {
                this.UpdateHints();
            }
        }
        
        
    };

}());

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

}());

// just for debug
var ui;

$(document).ready(function () {
    var evil,easy ;
    ui  = new Sudoku.UI();
        evil        =  [0,6,5,0,0,0,0,7,0,
                        0,0,0,7,0,0,2,0,0,
                        0,0,0,0,4,0,9,1,0,
                        0,7,0,0,8,9,5,0,0,
                        0,0,0,0,3,0,0,0,0,
                        0,0,8,2,7,0,0,4,0,
                        0,5,6,0,9,0,0,0,0,
                        0,0,7,0,0,8,0,0,0,
                        0,2,0,0,0,0,1,9,0];

        easy = [0,2,5,0,0,0,9,0,4,
                0,8,0,4,0,0,6,0,0,
                6,0,0,9,0,0,2,8,1,
                8,0,0,0,4,0,5,1,0,
                0,0,2,8,0,3,7,0,0,
                0,6,4,0,7,0,0,0,8,
                2,5,1,0,0,9,0,0,7,
                0,0,8,0,0,6,0,9,0,
                7,0,6,0,0,0,8,3,0];
 
    ui.Populate(evil);
    ui.ReadGrid();
    ui.SetupClickHandlers();
    ui.SetupHints();
    ui.UpdateHints();
});
