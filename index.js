
var express = require('express');
var socket = require('socket.io');
app = express();

const port = 5000;//process.env.PORT ||

var server = app.listen(port, function() {
    console.log('Listening on port 5000\n');
});

app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res) {
    res.render(__dirname+'/public/index.html');
});

var users = [];
var typingUsers = [];


var io = socket(server);
io.on('connection', function(socket) {
    console.log('Socket made');
    socket.on('newUser', function(data) {
        console.log("New user connected:", data.name);
        socket.username = data.name;
        users.push(data.name);
        updateUsers();
    })
    function updateUsers() {
        io.sockets.emit('usersUpdate', users);
    }

    // HANDLE DISCONNECTION EVENT
    socket.on('disconnect', function() {
        console.log("Disconnected");
        // remove user from users list
        users.splice(users.indexOf(socket.username), 1);

        // update users in frontend
        updateUsers();
    })

    // HANDLE NEW MESSAGE 
    socket.on('newMsg', function(data) {
        console.log('Received: ', data);
        io.sockets.emit('RecOtherMsg', {
            name: socket.username,
            msg: data
        });
    });

    // HANDLE KEYPRESS EVENT
    socket.on('typing', function(data) {
        console.log(socket.username,'is typing');
        if(data == false) {
            typingUsers.splice(typingUsers.indexOf(socket.username), 1);
        }
        else {
            typingUsers.push(socket.username);
        }
        io.sockets.emit('typingUsersUpdate', typingUsers);
    });

});

