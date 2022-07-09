import express  from "express";
import socketio from 'socket.io';
import http from 'http'
import https from 'https'
import path from "path"
import fs from 'fs'

const app = express();

const httpServer = https.createServer({
    key: fs.readFileSync('./.cert/localhost-private.pem'),
    cert: fs.readFileSync('./.cert/localhost-cert.pem'),
    //passphrase: '04061998666'
},app);

//const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'public'));
app.engine('html', require('ejs').renderFile);
app.set('views engine', 'html');


app.use('/', (req, res)=>{
    res.render('index.html')
})

let messagens: any[] = [];

io.on('connection', (socket)=>{
    console.log(`new connection: ${socket.id}`)

    socket.emit('previousMessage', messagens);

    socket.on('sendMessage', data =>{
        messagens.push(data);
        socket.broadcast.emit('receivedMessage', data);

    })

})

httpServer.listen(3333);