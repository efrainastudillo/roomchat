const debug = require('debug');
const expressSession = require('express-session');
var sharedsession = require("express-socket.io-session");
const csv2json = require('csvtojson');
// Routes
const userRouter = require('./routes/user.routes');
const chatRouter = require('./routes/chat.routes');

const express = require('express');
const config = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const redirectLogin = require('./helpers/user.helper').redirectLogin;

const app = express();
var bodyParser = require('body-parser')
const http = require('http');

const server = http.createServer(app);
const io = require('socket.io')(server);

debug.enable('chat:*');
const LOG = debug('chat:database');
config.config();
const https = require('https');
const User = require('./models/user.model');

/**
 * Create a Session
 */
const session = expressSession({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: process.env.PRIVATE_KEY,
    cookie: {
        maxAge: 1000*60*5,
        sameSite: true,
        secure: false
    }
});
app.use(session);
/**
 * Chat Room setup
 */
io.use(sharedsession(session, {
    autoSave:true
}));
io.on('connection', (socket) => {
    const LOG = debug('chat:socket.io');
    LOG(`User connected ${socket.id}`);
    
    socket.on('chat', (msg) => {

        const tokens = msg.msg.split('=');
        console.log('tokens :::: ' + tokens[1]);
        
        if(tokens[0] === '/stock') {
            let data = '';
            
            https.get(`https://stooq.com/q/l/?s=${tokens[1]}&f=sd2t2ohlcv&h&e=csv`, resp => {
                resp.on('data', chunk => {
                    data+= chunk;
                });

                resp.on('end', () => {
                    //convert data to json and emit the message through socket
                    csv2json().fromString(data)
                    .then( result => {
                        console.log(result);
                        let msg = '';
                        for(let i = 0; i < result.length; ++i){
                            msg = `${result[i].Symbol} quote is ${result[i].Close} per share.\n`;
                        }
                        const date = new Date();
                        socket.broadcast.emit('chat', {msg: msg, timestamp: date});
                    });
                });
            });
        }
        else {
            const username = socket.handshake.session.user.username;
            if(username){
                User.findOne({username: username})
                .then( result => {
                    if(result != null){
                        result.messages.push({msg: msg.msg, timestamp: msg.timestamp});
                        result.save();
                    }
                });
            }
            socket.broadcast.emit('chat', {msg: msg.msg, timestamp: msg.timestamp});
        }
    });

    socket.on('disconnect', (event) => {
        LOG(` User disconnected ${event}`);
    });
});

app.use('/static', express.static('./public'));

// Configure Express to use EJS
app.set('views', path.join(process.env.ROOT_URL, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use('', userRouter); // i.e. login, signup routes
app.use('', redirectLogin, chatRouter); // chat route

options = { 
    useUnifiedTopology: true,
    useNewUrlParser: true 
}
mongoose.connect(process.env.DBURI, options).then((data) => {
    LOG('Database connected!!!');
    server.listen(process.env.PORT, data => {
        LOG(`Server started on port ${process.env.PORT}.`);
    });
}).catch((err) => {
    LOG(`Error connecting Database - ${err}`);
});

