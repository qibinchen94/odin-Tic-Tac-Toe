const Player = (name, choice) => {
    return {
        name,
        choice,
    };
};

// const players = [Player('player X', 'X'),
//                 Player('player O', 'O')]

const game = (() => {
    const dimension = 3;
    const players = new Array(2);
    let currentPlayerIndex = 0;
    let moveCount = 0;
    const rows = Array(dimension).fill('').map(() => [0, 0]);
    const columns = Array(dimension).fill('').map(() => [0, 0]);
    const diag = [0, 0];
    const reverseDiag = [0, 0];

    // The following syntax is not working because
    // fill method create references.
    // See: https://stackoverflow.com/questions/41121982/strange-behavior-of-an-array-filled-by-array-prototype-fill
    //  const board = Array(3).fill(Array(3).fill('')); 
    let gameBoard = Array(dimension).fill('').map(() => Array(dimension).fill(''));
    
    const _updateBoard = function () {
        moveCount++;
        const row = +this.dataset.row;
        const column = +this.dataset.column;
        this.textContent = players[currentPlayerIndex].choice;
        gameBoard[row][column] = players[currentPlayerIndex].choice;
        this.classList.add('disable-pointer');
        
        if (_hasWinner(row, column)) {
            alert('Winner is: ' + players[currentPlayerIndex].name);
        }
        
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };
    
    // Determine the winner
    // See: https://stackoverflow.com/a/1610176
    const _hasWinner = (row, column) => {
        if (++rows[row][currentPlayerIndex] > 2) return true;
        if (++columns[column][currentPlayerIndex] > 2) return true;
        if (row === column) {
            if (++diag[currentPlayerIndex] > 2) return true;
        } 
        if (row + column === dimension - 1) {
            if (++reverseDiag[currentPlayerIndex] > 2) return true;
        }
        if (moveCount > 8) {
            alert("It's a draw!")
        }
        return false;        
    }
    
    const _startGame = function () {
        if (!inputs[0].value || !inputs[1].value) {
            alert("Please enter player's name.");
            return;
        } else {
            players[0] = Player(inputs[0].value, 'X');
            players[1] = Player(inputs[1].value, 'O');
            cells.forEach(cell => cell.classList.remove('disable-pointer'));
            button.textContent = 'Restart';
            button.removeEventListener('click', _startGame);
            button.addEventListener('click', _restartGame);
        }
    };
    
    const _restartGame = function () {
        inputs.forEach(input => input.value = '');
        cells.forEach(cell => cell.classList.add('disable-pointer'));
        cells.forEach(cell => cell.textContent = '');
        button.textContent = 'Start';
        gameBoard = Array(dimension).fill('').map(() => Array(dimension).fill(''));
        button.removeEventListener('click', _restartGame);
        button.addEventListener('click', _startGame);
    };
   
    const inputs = [...document.querySelectorAll('.player-name')];

    const cells = [...document.querySelectorAll('.cell')];
    cells.forEach(cell => cell.addEventListener('click', _updateBoard.bind(cell)));

    const button = document.querySelector('button.start');
    button.addEventListener('click', _startGame);

    const getBoard = () => gameBoard;

    return {
        getBoard,
    };
})();