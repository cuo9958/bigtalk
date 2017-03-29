var express = require('express'),
    io = require('socket.io');

var app = express();
app.use(express.static(__dirname + "/www"));
var server = app.listen(8888);
var ws = io.listen(server);
//用户列表
var userlist = [];
var User = function (client) {
    this.name = null;
    this.client = client;
    this.id = client.id;
    this.activity = new Date().getTime();
    this.status = "active";
    this.room = null;
    this.send = function (data) {
        this.client.send(data);
    };
    this.getRoom = function () {
        //return Rooms.getRoom(this.room);
    };
};

ws.on('connection', function (client) {
    client.user = new User(client);
    //加入并创建个人对象
    client.on('join', function (nickname) {
        client.user.name = nickname;
        userlist.push({
            id: client.user.id,
            name: client.user.name
        });
        client.emit('joined', client.id, userlist);
        ws.sockets.emit('add', client.id, client.user.name);
    });
    // 监听发送消息
    client.on('send.message', function (msg) {
        client.broadcast.emit('send.message', client.id, msg);
    });
    //监听移动
    client.on('move', function (msg) {
       
    });
    // 断开连接时，通知其它用户
    client.on('disconnect', function () {
        for (var i = 0; i < userlist.length; i++) {
            if (userlist[i].sessionId == client.sessionId) {
                userlist.splice(i, 1);
            }
        }
        client.broadcast.emit('leave', client.sessionId);
    });
})

