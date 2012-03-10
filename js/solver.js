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
