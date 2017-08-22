'use strict';

const express = require('express');
const app = express();
const Game = require('./src/game');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.get('/', (req, res) => {
  res.render('pages/index');
});

const server = app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

const io = require('socket.io').listen(server);
var game = game || new Game();   // game stored in local memory
io.on('connection', function(socket){
  console.log('a user connected');
  
  /*
    socket events:

    gameInfo     - gets a current game, if any
    newPlayer    - adds a new player to the game
    newGame      - indicates a new game has started
    startGame    - starts a game after 2 players are detected
    makeMove     - player makes a move
  */

  
  // immediately send out gameInfo to update UIs
  io.emit('gameInfo', game.toJson())

  socket.on('newPlayer', data => {
    // data = {'mark': 'X', 'name': 'Gang'}

    game.setPlayer(data.mark, data.name, socket.id);
    console.log(game.players)
    if (Object.keys(game.players).length == 2) {
        // start a new game
        game = new Game();
        io.emit('newGame');
        console.log('new game initiated');
    }
  })

  socket.on('makeMove', data => {
    // Server is the source of truth for turns
    // Client sends the position only
    // data = {pos: pos}

    game.setSquareAndChangeTurns(data.pos);
    io.emit('gameInfo', game.toJson());
  })

  socket.on('eraseGame', () => {
    // erase all player and game data
    game = new Game();
    io.emit('gameInfo', game.toJson());
  });


});