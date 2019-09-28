var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
const socket = require('socket.io')(http);
const PORT = process.env.PORT || 7000;

var store = {};

app.get('/' , function(req, res){
    res.sendFile(__dirname+'/view/index.html');
});

app.get('/shindan/' , function(req, res){
    res.sendFile(__dirname+'/view/shindan.html');
});

app.get('/super_shindan/' , function(req, res){
    res.sendFile(__dirname+'/view/super_shindan.html');
});

app.use('/asset', express.static('public'));


socket.on('connection',function(socket){
    socket.on('join',function(jobj){
        let userobj = {
            'room':jobj.roomId,
        };
        store[jobj.roomId] = userobj;
        socket.join(jobj.roomId);
    })
    
    socket.on('kekka_msg',function(msg){
        socket.to(store[msg.id].room).emit('kekka_msg', msg.aisyou);
    });
    socket.on('shindan_msg',function(msg){
        socket.to(store[msg.id].room).emit('shindan_msg', msg);
    });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});