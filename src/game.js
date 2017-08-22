'use strict';

module.exports = class Game {
    constructor() {
        this.turn = 'X';     // x always starts
        this.players = {};   // :socketId -> {:name, :mark}
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

    setPlayer (mark, name, socketId) {
        this.players[socketId] = {
            name: name,
            mark: mark
        }
    }    

    setSquareAndChangeTurns (pos) {
        this.board[pos] = this.turn;                    // set the 
        this.turn = this.turn === 'X' ? 'O' : 'X';
    }

    threeInARow (pos1, pos2, pos3) {
        let rowIsNotNull = this.board[pos1] !== null && this.board[pos2] !== null && this.board[pos3] !== null;
        let rowIsMatch = this.board[pos1] === this.board[pos2] && this.board[pos1] === this.board[pos3];
        if (rowIsNotNull && rowIsMatch) {
            return this.board[pos1];
        } else {
            return null;
        }
    }

    winnerOfGame () {
        let winner = (this.threeInARow('11', '12', '13') ||   // horizontal
                      this.threeInARow('21', '22', '23') ||   // horizontal
                      this.threeInARow('31', '32', '33') ||   // horizontal
                      this.threeInARow('11', '21', '31') ||   // vertical
                      this.threeInARow('12', '22', '32') ||   // vertical
                      this.threeInARow('13', '23', '33') ||   // vertical
                      this.threeInARow('11', '22', '33') ||   // diagonal
                      this.threeInARow('13', '22', '31'));

        return winner;   // winner is winning mark or null
    }

    getPlayers () {
        let players = {};
        Object.keys(this.players).forEach(socketId => {
            let player = this.players[socketId];
            players[player.mark] = player.name;
        });
        return players;
    }

    toJson () {
        return {
            turn: this.turn,
            board: this.board,
            players: this.getPlayers(),
            winner: this.winnerOfGame()
        };
    }
}