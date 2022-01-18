const Player = (name, choice) => {
    return {
        name,
        choice,
    };
};

const players = [Player('player1', 'X'),
                Player('player2', 'O')]

const game = (() => {
    const dimension = 3;
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
    const gameBoard = Array(dimension).fill('').map(() => Array(dimension).fill(''));
    
    const updateBoard = function () {
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
    
    const getBoard = () => gameBoard;
    
    return {
        getBoard,
        updateBoard,
    };
})();

const cells = [...document.querySelectorAll('.cell')];
cells.forEach(cell => cell.addEventListener('click', game.updateBoard.bind(cell)));