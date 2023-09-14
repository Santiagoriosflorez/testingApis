const express = require ('express');
const engine = require ('ejs-mate');
const path = require('path');
const socketIO = require('socket.io');
const http = require ('http')
const bodyParser= require ('body-parser')

//* Initializations 
const app = express();
const server= http.createServer(app);
const io= socketIO(server)

//* configuracion de body parser

app.use (bodyParser.urlencoded({ extended:false}))

//*settings
app.engine('ejs' , engine);
app.set ('view engine','ejs');
app.set ('views', path.join(__dirname + '/views'));


//*routes
app.use(require('./routes'));

//*sockets
require('./sockets')(io);

//* static files 
app.use(express.static (path.join(__dirname + '/public')));

//* starting the server 
server.listen (4000, () =>{
    console.log('Server on port 4000');
})