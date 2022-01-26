const MODULE = (() => {
    const _Player = (name, choice) => {
        return {
            name,
            choice,
        };
    };

    const _startPlay = () => {
        // Prompt "select a mode" if no mode is chosen
        if (!mode) {
            promptDiv.textContent = 'Please select a mode first';
            return;
        } 
        
        // Make the game board clickable
        cells.forEach(cell => cell.classList.remove('disable-pointer'));
        
        // Remove the _startPlay handler and add _replay handler
        playButton.textContent = 'Replay';
        playButton.removeEventListener('click', _startPlay);
        playButton.addEventListener('click', _replay.bind(null));

        playing  = true;
    };

    const _chooseMode = function () {
        if(playing) {
            if (mode !== this.className) {
                promptDiv.textContent = 'Click Reset to change mode';
                setTimeout(() => promptDiv.textContent = '', 1500); 
            }
            return;
        }

        promptDiv.textContent = '';
        mode = this.className;
        this.style.borderColor = 'red';

        // Reset border color if another mode button has already been clicked
        const otherButtons = modeButtons.filter(btn => {return btn.className !== mode;});
        otherButtons.forEach(btn => btn.style.removeProperty('border-color'));

        // Render output of the chosen mode
        switch (mode) {
            case 'PvP':
                leftPlayerDiv.textContent = 'perm_identity';
                rightPlayerDiv.textContent = 'perm_identity';
                players[0] = _Player('Player O', 'O');
                players[1] = _Player('Player X', 'X');
                break;
            case 'PvE':
                leftPlayerDiv.textContent = 'perm_identity';
                rightPlayerDiv.textContent = 'computer';
                players[0] = _Player('Player O', 'O');
                players[1] = _Player('Computer X', 'X');
                break;
            case 'EvE':
                leftPlayerDiv.textContent = 'computer';
                rightPlayerDiv.textContent = 'computer';
                players[0] = _Player('Computer O', 'O');
                players[1] = _Player('Computer X', 'X');
                break;
        }
    }

    const _replay = () => {
        // Clear the game board
        cells.forEach(cell => cell.textContent = '');
        cells.forEach(cell => cell.classList.remove('disable-pointer'));

        // Reset game board info
        gameBoard = Array(dimension).fill('').map(() => Array(dimension).fill(''));
        moveCount = 0;
        currentPlayerIndex = 0;

        // Clear prompt in case there's a winner
        promptDiv.textContent = '';
    };
    
    const _reset = () => {
        // Clear the game board and its info
        _replay();

        // Make the game board un-clickable
        cells.forEach(cell => {
            if(!cell.classList.contains('disable-pointer'))
                cell.classList.add('disable-pointer');
        });

        // Clear players icon and game mode
        leftPlayerDiv.textContent = '';
        rightPlayerDiv.textContent = '';
        mode = '';

        // Add _startPlay handler and remove _replay handler
        playButton.textContent = 'Start';
        playButton.removeEventListener('click', _replay);
        playButton.addEventListener('click', _startPlay.bind(null));

        // Remove mode button border color
        modeButtons.forEach(btn => btn.style.removeProperty('border-color'));

        // Clear prompt
        promptDiv.textContent = '';

        playing = false;
    }

    const _hasWinner = board => {
        const rows = Array(3).fill('').map(() => [0, 0]);
        const columns = Array(3).fill('').map(() => [0, 0]);
        const diag = [0, 0];
        const rDiag = [0, 0];
        for(let row = 0; row < 3; row++) {
            for(let column = 0; column < 3; column++) {
                if(board[row][column] === 'X') {
                    if (++rows[row][0] > 2) return true;
                    if (++columns[column][0] > 2) return true;
                    if (row === column) {
                        if (++diag[0] > 2) return true;
                    }
                    if (row + column === 2) {
                        if (++rDiag[0] > 2) return true;
                    }
                } else if (board[row][column] === 'O') {
                    if (++rows[row][1] > 2) return true;
                    if (++columns[column][1] > 2) return true;
                    if (row === column) {
                        if (++diag[1] > 2) return true;
                    }
                    if (row + column === 2) {
                        if (++rDiag[1] > 2) return true;
                    }
                }
            }
        }
        return false;
    }

    const _minimax = (board, depth, isMax, count, playerIndex) => {
        if(_hasWinner(board)) {
            return isMax ? depth - 10 : 10 - depth;
        }

        if(count === 9)
            return 0;
        
        const nextPlayerIndex = playerIndex === 0 ? 1 : 0;
        if(isMax) {
            let bestVal = -Infinity;
            for(let row = 0; row < 3; row++) {
                for(let column = 0; column < 3; column++) {
                    if(!board[row][column]) {
                        board[row][column] = players[playerIndex].choice;
                        const value = _minimax(board, depth + 1, false, count + 1, nextPlayerIndex);
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
                        board[row][column] = players[playerIndex].choice;
                        const value = _minimax(board, depth + 1, true, count + 1, nextPlayerIndex);
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
        const nextPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        for(let row = 0; row < 3; row++) {
            for(let column = 0; column < 3; column++) {
                if(!board[row][column]) {
                    board[row][column] = players[currentPlayerIndex].choice;
                    const value = _minimax(board, 0, false, moveCount + 1, nextPlayerIndex);
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

    const _updateGameBoard = (node, row, column) => {
        // Render game board display and update game board info
        node.textContent = players[currentPlayerIndex].choice;
        node.classList.add('disable-pointer');
        node.style.color = currentPlayerIndex === 0 ? 'cyan' : 'hotpink';
        
        // Update game board info
        gameBoard[row][column] = players[currentPlayerIndex].choice;
        moveCount++;
    }

    const _isGameOver = () => {
        if(_hasWinner(gameBoard)) {
            promptDiv.textContent = `Winner is ${players[currentPlayerIndex].name}!`;
            cells.forEach(cell => {
                if (!cell.classList.contains('disable-pointer'))
                cell.classList.add('disable-pointer');
            });
            return true;
        }
        
        if(moveCount === 9) {
            // If no move left 
            promptDiv.textContent = "It's a draw!";
            cells.forEach(cell => {
                if (!cell.classList.contains('disable-pointer'))
                    cell.classList.add('disable-pointer');
            });
            return true;
        }

        return false;
    }

    const _updateAiMove = () => {
        const aiMove = _findBestMove(gameBoard);
        const targetCell = document.querySelector(`.cell[data-row="${aiMove[0]}"][data-column="${aiMove[1]}"]`);
        _updateGameBoard(targetCell, aiMove[0], aiMove[1]);

        if(_isGameOver()) 
            return;

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const _updatePlayerMove = (node, row, column) => {
        _updateGameBoard(node, row, column);

        if(_isGameOver()) return;

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        if (players[currentPlayerIndex].name.includes('Computer')) {
            _updateAiMove();
        }            
    };

    const dimension = 3;
    let moveCount = 0;
    let gameBoard = Array(dimension).fill('').map(() => Array(dimension).fill(''));
    let currentPlayerIndex = 0;
    let mode = ''; // PvP, PvE, or EvE
    let playing = false; // If the game is being played
    const players = new Array(2);

    const modeButtons = [...document.querySelectorAll('.mode-container button')];
    modeButtons.forEach(btn => btn.addEventListener('click', _chooseMode.bind(btn)));
    
    const playButton = document.querySelector('.before-start-container button.play');
    playButton.addEventListener('click', _startPlay.bind(null));
    
    const resetButton = document.querySelector('.before-start-container button.reset');
    resetButton.addEventListener('click', _reset.bind(null));

    const cells = [...document.querySelectorAll('.cell')];
    cells.forEach(cell => cell.addEventListener('click', 
        _updatePlayerMove.bind(null, cell, +cell.dataset.row, +cell.dataset.column)));

    const promptDiv = document.querySelector('.before-start-container .prompt');
    const leftPlayerDiv = document.querySelector('.material-icons.icon.left');
    const rightPlayerDiv = document.querySelector('.material-icons.icon.right');

    const getBoard = () => gameBoard;

    return {
        getBoard,
    };
})();