import express  from "express";
import socketio from 'socket.io';
import http from 'http';
import path from "path";

const app = express();
const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'public'));
app.engine('html', require('ejs').renderFile);
app.set('views engine', 'html');


app.use('/', (req, res)=>{
    res.render('index.html')
})

let messagens = [];

io.on('connection', (socket)=>{
    console.log(`new connection: ${socket.id}`)

    socket.on('sendMessage', data =>{
        messagens.push(data);
    })

})

httpServer.listen(3333);