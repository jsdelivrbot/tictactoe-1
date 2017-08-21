'use strict';

const express = require('express');
const app = express();
const io = require('socket.io');
const Game = require('./src/game');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// game stored in local memory
let currentGame = null;
let players = {};   // should be two-element object keyed by socket id

app.get('/', (req, res) => {
  res.render('pages/index');
});

const server = app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

io.listen(server).on('connection', function(socket){
  console.log('a user connected');
  /*

    socket events:

    gameInfo     - gets a current game, if any
    newPlayer    - adds a new player to the game
    newGame      - indicates a new game has started
    startGame    - starts a game after 2 players are detected
    makeMove     - player makes a move
  */

  currentGame = new Game();

  io.sockets.emit('gameInfo', currentGame.toJson())

  socket.on('newPlayer', data => {
    // data = {'mark': 'X'}

    players[socket.id] = {
        mark: data.mark
    }

    console.log(players)
    if (Object.keys(players).length == 2) {
        // start a new game
        currentGame = new Game();
        io.sockets.emit('newGame');
    }
  })

  socket.on('makeMove', data => {
    // Server is the source of truth for turns
    // Client sends the position only
    // data = {pos: pos}

    currentGame.setSquareAndChangeTurns(data.pos);
    io.sockets.emit('gameInfo', currentGame.toJson());
  })

  socket.on('eraseGame', () => {
    // erase all player and game data
    players = {};
    currentGame = new Game();
    io.sockets.emit('gameInfo', currentGame.toJson());
  });


});