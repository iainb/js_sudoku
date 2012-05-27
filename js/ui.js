(function () {
    
    function UI () {

        this.solver = new Sudoku.Solver();
        this.puzzles = new Sudoku.Puzzles();

        this.initial = [];
        this.solved  = [];

        this.displayhints = false;

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
        
        $('#enablehints').click(function () {
            if (self.displayhints === false) {
                self.displayhints = true;
                self.UpdateHints();
            }
        });

        $('#disablehints').click(function () {
            if (self.displayhints === true) {
                self.displayhints = false;
                self.UpdateHints();
            }
        });

        // disablehints selected by default

        $('#disablehints').button('toggle');

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
