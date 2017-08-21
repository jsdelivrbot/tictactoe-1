var express = require('express');
var app = express();

const Game = require('./src/game');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// game stored in local memory
let currentGame = null;

app.get('/', (request, response) => {
  response.render('pages/index');
});

app.post('/move', (request, response) => {
    console.log(request);
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
