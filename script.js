const Player = (name, choice) => {
    return {
        name,
        choice,
    };
};

// const players = [Player('Player', 'X'),
//                 Player('AI', 'O')]

const MODULE = (() => {
    const dimension = 3;
    const players = new Array(2);
    let moveCount = 0;
    let gameBoard = Array(dimension).fill('').map(() => Array(dimension).fill(''));

    const _evaluate = board => {
        const rows = Array(3).fill('').map(() => [0, 0]);
        const columns = Array(3).fill('').map(() => [0, 0]);
        const diag = [0, 0];
        const rDiag = [0, 0];
        for(let row = 0; row < 3; row++) {
            for(let column = 0; column < 3; column++) {
                if(board[row][column] === 'X') {
                    // AI ('X') wins
                    if (++rows[row][0] > 2) return 10;
                    if (++columns[column][0] > 2) return 10;
                    if (row === column) {
                        if (++diag[0] > 2) return 10;
                    }
                    if (row + column === 2) {
                        if (++rDiag[0] > 2) return 10;
                    }
                } else if (board[row][column] === 'O') {
                    if (++rows[row][1] > 2) return -10;
                    if (++columns[column][1] > 2) return -10;
                    if (row === column) {
                        if (++diag[1] > 2) return -10;
                    }
                    if (row + column === 2) {
                        if (++rDiag[1] > 2) return -10;
                    }
                }
            }
        }
        return 0;
    }
    
    const _hasWinner = board => {
        if(_evaluate(board)) return true;
        return false;
    }

    // const _updateBoardInfo = (board, row, column) => {
    //     board.gameBoard[row][column] = players[board.playerIndex].choice;
    //     board.moveCount++;

    //     // Update scores
    //     if (++board.scores.rows[row][board.playerIndex] > 2) board.isGameOver = true;
    //     if (++board.scores.columns[column][board.playerIndex] > 2) board.isGameOver = true;
    //     if (row === column) {
    //         if (++board.scores.diag[board.playerIndex] > 2) board.isGameOver = true;
    //     }
    //     if (row + column === dimension - 1) {
    //         if (++board.scores.reverseDiag[board.playerIndex] > 2) board.isGameOver = true;
    //     }

    //     return JSON.parse(JSON.stringify(board));
    // };

    const _updateAiMove = () => {
        console.log(gameBoard);
        const aiMove = _findBestMove(gameBoard);
        gameBoard[aiMove[0]][aiMove[1]] = 'X';
        moveCount++;

        // Render display of the board
        const targetCell = document.querySelector(`.cell[data-row="${aiMove[0]}"][data-column="${aiMove[1]}"]`);
        targetCell.textContent = players[1].choice;
        targetCell.classList.add('disable-pointer');

        if(_hasWinner(gameBoard)) {
            alert('Winner is: ' + players[1].name);
            cells.forEach(cell => {
                if (!cell.classList.contains('disable-pointer'))
                    cell.classList.add('disable-pointer');
            });
            return;
        }

        if(moveCount === 9) {
            alert("It's a draw!");
            cells.forEach(cell => {
                if (!cell.classList.contains('disable-pointer'))
                    cell.classList.add('disable-pointer');
            });
            return;
        }

    }

    const _updateBoard = function (node, row, column) {
        console.log(gameBoard);
        // Render display of the board
        node.textContent = players[0].choice;
        node.classList.add('disable-pointer');
        
        gameBoard[row][column] = players[0].choice;
        moveCount++;

        if(_hasWinner(gameBoard)) {
            alert('Winner is: ' + players[0].name);
            cells.forEach(cell => {
                if (!cell.classList.contains('disable-pointer'))
                    cell.classList.add('disable-pointer');
            });
            return;
        }

        if(moveCount === 9) {
            alert("It's a draw!");
            cells.forEach(cell => {
                if (!cell.classList.contains('disable-pointer'))
                    cell.classList.add('disable-pointer');
            });
            return;
        }

        _updateAiMove();
    };
    
    
    const _minimax = (board, depth, isMax, count) => {
        const score = evaluate(board);
        if(score !== 0) {
            // return isMax ? score - depth : score + depth;
            return score;
        }

        if(count === 9)
            return 0;
        
        if(isMax) {
            let bestVal = -Infinity;
            for(let row = 0; row < 3; row++) {
                for(let column = 0; column < 3; column++) {
                    if(!board[row][column]) {
                        board[row][column] = 'X';
                        const value = minimax(board, depth + 1, false, count + 1);
                        bestVal = Math.max(value, bestVal);
                        board[row][column] = '';
                    }
                }
            }
            return bestVal;
        } else {
            let bestVal = +Infinity;
            for(let row = 0; row < 3; row++) {
                for(let column = 0; column < 3; column++) {
                    if(!board[row][column]) {
                        board[row][column] = 'O';
                        const value = minimax(board, depth + 1, true, count + 1);
                        bestVal = Math.min(value, bestVal);
                        board[row][column] = '';
                    }
                }
            }
            return bestVal;
        }
    }
    
    const _findBestMove = board => {
        let bestMove = null;
        let bestValue = -Infinity;
        for(let row = 0; row < 3; row++) {
            for(let column = 0; column < 3; column++) {
                if(!board[row][column]) {
                    board[row][column] = 'X';
                    const value = minimax(board, 0, false, moveCount + 1);
                    if(value >= bestValue) {
                        bestValue = value;
                        bestMove = [row, column];
                    }
                    board[row][column] = '';
                }
            }
        }
        return bestMove;
    }
    
    const _startGame = function () {
        if (!inputs[0].value || !inputs[1].value) {
            alert("Please enter player's name.");
            return;
        } else {
            // ! Change if players change too
            players[0] = Player(inputs[0].value, 'O');
            players[1] = Player(inputs[1].value, 'X');

            cells.forEach(cell => cell.classList.remove('disable-pointer'));
            button.textContent = 'Restart';
            button.removeEventListener('click', _startGame);
            button.addEventListener('click', _restartGame);
        }
    };
    
    const _restartGame = function () {
        gameBoard = Array(dimension).fill('').map(() => Array(dimension).fill(''));
        moveCount = 0;
        cells.forEach(cell => cell.textContent = '');
        button.textContent = 'Start';
        button.removeEventListener('click', _restartGame);
        button.addEventListener('click', _startGame);
    };
   
    const inputs = [...document.querySelectorAll('.player-name')];

    const cells = [...document.querySelectorAll('.cell')];
    cells.forEach(cell => cell.addEventListener('click', 
                _updateBoard.bind(null, cell, +cell.dataset.row, +cell.dataset.column)));

    const button = document.querySelector('button.start');
    button.addEventListener('click', _startGame);

    const getBoard = () => gameBoard;

    return {
        getBoard,
    };
})();

// const cases = [
//     // Next move is for AI ('X')
//     [['X', 'O', 'X'],
//      ['O', 'O', 'X'],
//      ['', '', '']
//     ], // Output [2, 2]
//     [['O', '', ''],
//      ['', '', ''],
//      ['', '', '']
//     ], // Output [1, 1]
//     [['O', '', ''],
//      ['', 'O', ''],
//      ['', '', 'O']
//     ],
//     [['O', '', 'X'],
//      ['X', '', ''],
//      ['X', 'O', 'O']
//     ]
// ]

// const choice = 2;
// const gameBoard = cases[choice];
// let move = findBestMove(gameBoard);
// console.log(move);

// function findBestMove(board) {
//     let bestMove = null;
//     let bestValue = -Infinity;
//     for(let row = 0; row < 3; row++) {
//         for(let column = 0; column < 3; column++) {
//             if(!board[row][column]) {
//                 board[row][column] = 'X';
//                 const value = minimax(board, 0, false);
//                 if(value >= bestValue) {
//                     bestValue = value;
//                     bestMove = [row, column];
//                 }
//                 board[row][column] = '';
//             }
//         }
//     }
//     return bestMove;
// }

// function minimax(board, depth, isMaximizingPlayer) {
//     const score = evaluate(board);
//     if(score !== 0) {
//         // return isMaximizingPlayer ? score - depth : score + depth;
//         return score;
//     }

//     if(!isMoveLeft(board))
//         return 0;
    
//     if(isMaximizingPlayer) {
//         let bestVal = -Infinity;
//         for(let row = 0; row < 3; row++) {
//             for(let column = 0; column < 3; column++) {
//                 if(!board[row][column]) {
//                     board[row][column] = 'X';
//                     const value = minimax(board, depth + 1, false);
//                     bestVal = Math.max(value, bestVal);
//                     board[row][column] = '';
//                 }
//             }
//         }
//         return bestVal;
//     } else {
//         let bestVal = +Infinity;
//         for(let row = 0; row < 3; row++) {
//             for(let column = 0; column < 3; column++) {
//                 if(!board[row][column]) {
//                     board[row][column] = 'O';
//                     const value = minimax(board, depth + 1, true);
//                     bestVal = Math.min(value, bestVal);
//                     board[row][column] = '';
//                 }
//             }
//         }
//         return bestVal;
//     }
// }

// function evaluate(board) {
//     const rows = Array(3).fill('').map(() => [0, 0]);
//     const columns = Array(3).fill('').map(() => [0, 0]);
//     const diag = [0, 0];
//     const rDiag = [0, 0];
//     for(let row = 0; row < 3; row++) {
//         for(let column = 0; column < 3; column++) {
//             if(board[row][column] === 'X') {
//                 // AI ('X') wins
//                 if (++rows[row][0] > 2) return 10;
//                 if (++columns[column][0] > 2) return 10;
//                 if (row === column) {
//                     if (++diag[0] > 2) return 10;
//                 }
//                 if (row + column === 2) {
//                     if (++rDiag[0] > 2) return 10;
//                 }
//             } else if (board[row][column] === 'O') {
//                 if (++rows[row][1] > 2) return -10;
//                 if (++columns[column][1] > 2) return -10;
//                 if (row === column) {
//                     if (++diag[1] > 2) return -10;
//                 }
//                 if (row + column === 2) {
//                     if (++rDiag[1] > 2) return -10;
//                 }
//             }
//         }
//     }
//     return 0;
// }

// function isMoveLeft(board) {
//     for(let row = 0; row < 3; row++) {
//         for(let column = 0; column < 3; column++) {
//             if(!board[row][column])
//                 return true;
//         }
//     }
//     return false;
// }