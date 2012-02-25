(function () {
    function Sudoku() {
        this.gridsize = 9;
        
    }

    this.Sudoku = Sudoku;

    Sudoku.prototype.Solve = function (a) {
        var n_solved,best;
        a = [].concat(a);

        while(!this.IsSolved(a)) {
            n_solved = 0;
            best = { val: [1,2,3,4,5,6,7,8,9], id: 0}; 
            for (i=0;i<a.length;i=i+1) {
                if (a[i] === 0) {
                    p = this.Possible(a,i);
                    if (p.length < best.val.length) {
                        best.val = p;
                        best.id  = i;
                    }
                    if (p.length === 1) {
                        console.log('set ' + i + ' to ' + p[0]);
                        console.log('row',this.FetchRow(a,i));
                        console.log('col',this.FetchColumn(a,i));
                        console.log('squ',this.FetchSquare(a,i));
                        a[i] = p[0];
                        console.log(this.Print(a));
                        n_solved = n_solved + 1;
                    }   
                    
                    if (p.length === 0) {
                        console.log('error: ' + i);
                        console.log('row',this.FetchRow(a,i));
                        console.log('col',this.FetchColumn(a,i));
                        console.log('squ',this.FetchSquare(a,i));
                        return a;
                    }
                }
            }
            if (n_solved == 0) {
                console.log('error: infinite loop');
                console.log('best',best);
                // make a guess instead
                a[best.id] = best.val[0];
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
        end   = start + this.gridsize

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
        start = (j % this.gridsize)
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
        var i,r,diff, hstart;
       
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
        var i,j,s;
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

var easy,s,r;

// broken?
easyb = [7,0,1,5,9,0,0,4,0,
        8,3,0,0,6,0,1,9,0,
        0,9,2,0,0,0,0,0,0,
        0,0,0,9,1,0,8,6,0,
        0,0,8,6,0,4,5,0,0,
        0,5,6,0,7,8,0,0,0,
        0,0,0,0,0,0,7,3,0,
        0,7,4,0,3,0,0,1,2,
        0,2,0,0,4,9,6,0,5];

easy = [0,3,4,0,1,0,0,6,0,
        0,0,0,0,2,8,0,0,0,
        1,8,9,6,0,0,3,0,0,
        6,0,0,5,0,0,0,3,0,
        3,0,1,2,0,7,5,0,8,
        0,9,0,0,0,3,0,0,6,
        0,0,5,0,0,6,4,8,1,
        0,0,0,1,8,0,0,0,0,
        0,1,0,0,5,0,6,7,0];


medium = [0,3,6,1,0,0,5,0,0,
          0,0,8,0,6,0,0,3,0,
          0,2,0,8,0,0,0,0,0,
          0,0,3,4,5,0,0,9,0,
          0,9,0,0,0,0,0,1,0,
          0,1,0,0,2,6,4,0,0,
          0,0,0,0,0,9,0,7,0,
          0,7,0,0,4,0,8,0,0,
          0,0,1,0,0,8,6,2,0];

medium2 = [0,0,1,8,0,0,0,0,7,
           0,0,3,0,2,0,1,0,0,
           2,7,5,0,9,0,8,0,0,
           0,8,0,0,0,0,0,0,9,
           0,1,0,0,7,0,0,3,0,
           5,0,0,0,0,0,0,1,0,
           0,0,4,0,3,0,9,8,1,
           0,0,9,0,6,0,7,0,0,
           1,0,0,0,0,9,6,0,0];

s = new Sudoku();
//s.Print(easy);
//r = s.Solve(easy);
//s.Print(r);
