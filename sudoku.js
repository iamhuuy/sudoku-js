var reset = "";
var totalSeconds = 0;
var timer = null;
var matrix = [];

function generate() {
    matrix = [];
    var arr = [];
    var col = 0;
    var result = "";
    var templates = [
        "004300209005009001070060043006002087190007400050083000600000105003508690042910300",
        "600120384008459072000006005000264030070080006940003000310000050089700000502000190",
        "000000657702400100350006000500020009210300500047109008008760090900502030030018206",
        "065370002000001370000640800097004028080090001100020940040006700070018050230900060",
        "850420370003000010000170009000500602029304000010000438046090805005000900702840003",
        "680905000003000508402108703390720800000000010045006900060804002001002075700013000",
        "020980040030047601019006080700490000800023907000605000904800006001000300350014020",
        "290041000470302050000060208039400005100000070504100603613200704000003080005900100",
        "431800006000300010000006205609134070020000040000570089003659020500080104807000003",
        "503070190000006750047190600400038000950200300000010072000804001300001860086720005",
        "900084060604005207030070080760001500053000001000409603105026090002040000800003710",
        "205040003001009000046001587004607090802000056090020340170008200000500800500903001",
        "065370002000001370000640800097004028080090001100020940040006700070018050230900060",
        "700084005300701020080260401624109038803600010000000002900000000001005790035400006",
        "497200000100400005000016098620300040300900000001072600002005870000600004530097061",
        "807000000610005430400690000002800709003007820900051046000009670054000000200403018",
        "107008000650100000300060072060030250480009700001407009000000800003980015040203060",
        "980046025000090700700300004008023010045070008000105006014800900506000307090002600",
        "270600050000070406006059030040005600081000040029006173390000002000097800807140005",
        "206597403080103000507000009000004210028006500409010060700305000001200000300480902",
    ];
    var matrixTemp = templates[Math.floor(Math.random() * templates.length)];

    reset = matrix;
    for (var i = 0; i < 81; i++) {
        // Insert value to display
        if (matrixTemp[i] == "0")
            result = null;
        else
            result = parseInt(matrixTemp[i]);

        document.getElementById("cell-" + i).value = result;

        // Push value into matrix
        if (result == null)
            result = 0;

        if (col < 9) {
            pushArray(arr, result);
            col++;
        } else {
            matrix.push(arr);
            col = 0;
            arr = [];
            pushArray(arr, result);
            col++;
        }

        if (i == 80) {
            matrix.push(arr);
        }
    }

    // Disable null value Cell in Sudoku Board
    for (var i = 0; i < 81; i++) {
        var disable = document.getElementById("cell-" + i).value;
        if (disable != "")
            document.getElementById("cell-" + i).disabled = true;
        else
            document.getElementById("cell-" + i).disabled = false;
    }

    // Set time to default
    stop();
    document.getElementById("seconds").innerHTML = "0";
    totalSeconds = 0;
    timer = null;
}

function pushArray(array, value) {
    array.push(value);
}

// Is the Sudoku Board solved?
function isSolved(matrix) {
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix.length; j++) {
            if (matrix[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

function solve(matrix) {
    if (isSolved(matrix)) {
        return matrix;
    } else {
        const possibilites = nextMatrixes(matrix);
        const validMatrix = keepOnlyValid(possibilites);
        return searchForSolution(validMatrix);
    }
}

function searchForSolution(matrix) {
    if (matrix.length < 1) {
        return false;
    } else {
        var fisrt = matrix.shift();
        const tryPath = solve(fisrt);
        if (tryPath != false) {
            return tryPath;
        } else {
            return searchForSolution(matrix);
        }
    }
}

function nextMatrixes(matrix) {
    var res = [];
    const firstEmpty = findEmptyCell(matrix);
    if (firstEmpty != 0) {
        const y = firstEmpty[0];
        const x = firstEmpty[1];
        for (var i = 1; i <= 9; i++) {
            var newMatrix = [...matrix];
            var row = [...newMatrix[y]];
            row[x] = i;
            newMatrix[y] = row;
            res.push(newMatrix);
        }
    }
    return res;
}

function findEmptyCell(matrix) {
    // matrix -> [int, int]
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (matrix[i][j] == 0) {
                return [i, j];
            }
        }
    }
}

function keepOnlyValid(matrixes) {
    return matrixes.filter(m => validMatrix(m));
}

function validMatrix(matrix) {
    return validCols(matrix) && validRows(matrix) && validChildMatrix(matrix);
}

// Start the time record
function timeStart() {
    var secondsLabel = document.getElementById("seconds");

    if (!timer) {
        timer = setInterval(setTime, 1000);
    }

    function setTime() {
        totalSeconds++;
        secondsLabel.innerHTML = totalSeconds;
    }
}

function validRows(matrix) {
    for (var i = 0; i < 9; i++) {
        var current = [];
        for (var j = 0; j < 9; j++) {
            if (current.includes(matrix[i][j])) {
                return false;
            } else if (matrix[i][j] != 0) {
                current.push(matrix[i][j]);
            }
        }
    }
    return true;
}

function validCols(matrix) {
    for (var i = 0; i < 9; i++) {
        var current = [];
        for (var j = 0; j < 9; j++) {
            if (current.includes(matrix[j][i])) {
                return false;
            } else if (matrix[j][i] != 0) {
                current.push(matrix[j][i]);
            }
        }
    }
    return true;
}

function validChildMatrix(matrix) {
    const childMatrixCoordinates = [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2]
    ];

    for (var y = 0; y < 9; y += 3) {
        for (var x = 0; x < 9; x += 3) {
            var current = [];
            for (var i = 0; i < 9; i++) {
                var coordinates = [...childMatrixCoordinates[i]];
                coordinates[0] += y;
                coordinates[1] += x;
                if (current.includes(matrix[coordinates[0]][coordinates[1]])) {
                    return false;
                } else if (matrix[coordinates[0]][coordinates[1]] != 0) {
                    current.push(matrix[coordinates[0]][coordinates[1]]);
                }
            }
        }
    }
    return true;
}

function fillAllSudoku() {
    matrix = solve(matrix);
    console.log(matrix);
    var cell = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            document.getElementById("cell-" + cell).value = matrix[i][j];
            cell++;
        }
    }
}

// function printMatrix() {
//     const fs = require('fs');

//     var filename = 'matrix.txt';
//     var file = fs.createWriteStream('./output/' + filename);

//     file.on('error', function (err) { /* error handling */ });
//     arr.forEach(function (v) { file.write('[' + v.join(', ') + '],\n'); });
//     file.end();
// }

function check() {
    console.log(matrix);
    var current = [];
    var col = 0;
    var arr = [];
    var value = "";
    for (var i = 0; i < 81; i++) {
        if (document.getElementById("cell-" + i).value == "") {
            value = "0";
        } else {
            value = document.getElementById("cell-" + i).value;
        }

        value = parseInt(value);

        if (col < 9) {
            pushArray(arr, value);
            col++;
        } else {
            current.push(arr);
            col = 0;
            arr = [];
            pushArray(arr, value);
            col++;
        }

        if (i == 80) {
            current.push(arr);
        }
    }

    if (validMatrix(current)) {
        document.getElementById("check_msg").innerHTML = "It's look good";
    } else {
        document.getElementById("check_msg").innerHTML = "You got something wrong :(";
    }
}

function printValue(value) {
    console.log(value);
}

// Download Sudoku matrix
function download() {
    var filename = 'sudoku.txt';
    var element = document.createElement('a');

    var file = "";

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            file += matrix[i][j] + " ";

            if (j == 8) {
                file += "\n";
            }
        }
    }

    element.style.display = 'none';

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file));

    element.setAttribute('download', filename);
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Stop game
function stop() {
    clearInterval(timer);
    document.getElementById("time_msg").innerHTML =
    "You took about " + (totalSeconds / 60).toFixed(0) + " minutes " + (totalSeconds % 60) + " seconds";
}
