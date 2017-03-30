var express = require('express'),
    io = require('socket.io');

var app = express();
app.use(express.static(__dirname + "/www"));
var server = app.listen(8888);
var ws = io.listen(server);
//用户列表
var userlist = {};
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
    //加入并创建个人对象
    client.on('join', function (nickname, x, y) {
        var user = {
            id: client.id,
            name: nickname,
            x: x,
            y: y
        };
        userlist[client.id] = user;
        client.emit('joined', client.id, userlist);
        client.broadcast.emit('add', user);
    });
    // 监听发送消息
    client.on('send.message', function (msg) {
        client.broadcast.emit('send.message', client.id, msg);
    });
    //监听移动
    client.on('move', function (x, y) {
        var user = userlist[client.id];
        user.x = x;
        user.y = y;
        client.broadcast.emit("moved", user);
    });
    // 断开连接时，通知其它用户
    client.on('disconnect', function () {
        delete userlist[client.id];
        client.broadcast.emit('leave', client.id);
    });
})

