'use strict';

module.exports = class Game {
    constructor() {
        this.turn = 'x';     // x always starts
        this.board = {       // 1-3 represents the coordinates of the board
            '11': null,      // '11' is position (1,1), or the upper left corner
            '12': null,
            '13': null,
            '21': null,
            '22': null,
            '23': null,
            '31': null,
            '32': null,
            '33': null,
        }
    }

    setSquareAndChangeTurns (pos) {
        this.board(pos) = this.turn;                    // set the 
        this.turn = this.turn === 'x' ? 'o' : 'x';
    }

    threeInARow (pos1, pos2, pos3) {
        let rowIsNotNull = this.board[pos1] !== null && this.board[pos2] !== null && this.board[pos3] !== null;
        let rowIsMatch = this.board[pos1] === this.board[pos2] && this.board[pos1] === this.board[pos3];
        return rowIsNotNull && rowIsMatch;
    }

    winnerOfGame () {
        if (this.threeInARow('11', '12', '13') ||   // horizontal
            this.threeInARow('21', '22', '23') ||   // horizontal
            this.threeInARow('31', '32', '33') ||   // horizontal
            this.threeInARow('11', '21', '31') ||   // vertical
            this.threeInARow('12', '22', '32') ||   // vertical
            this.threeInARow('13', '23', '33') ||   // vertical
            this.threeInARow('11', '22', '33') ||   // diagonal
            this.threeInARow('13', '22', '31')) {   // diagonal
            return this.turn;
        } else {
            return null;
        }
    }

    toJson () {
        return {
            turn: this.turn,
            board: this.board,
            winner: this.winnerOfGame()
        };
    }
}