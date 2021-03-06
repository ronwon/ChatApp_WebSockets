
// make connection
// var socket = io.connect('https://chat-mm.herokuapp.com:5000');//http://192.168.43.140
var socket = io();
var name;

var btn = document.getElementById('bttn');
var inp = document.getElementById('username');
var onlineUserArea = document.getElementById('users');
var msgArea = document.getElementById('messageArea');
var userFormArea = document.getElementById('userFormArea');
var msgBtn = document.getElementById('msgBtn');
var msgInput = document.getElementById('msgInput');
var chatArea = document.getElementById('chat');
var feedback = document.getElementById('feedback');
var loader = document.querySelector('.loader');
// var progress = document.querySelector('.progress');
var main = document.querySelector('.container');

function init() {
    setTimeout(() => {
        loader.style.display = 'none';
        loader.style.opacity = 0;
        main.style.display = 'block';
        // main.style.opacity = 1;
        setTimeout(() => main.style.opacity=1, 20);
    }, 2500);
}

init();

btn.addEventListener('click', function() {
    event.preventDefault();
    name = inp.value;
    if(name == '' || name == null) {
        alert('Enter a valid USERNAME');
    }
    else {
        socket.emit('newUser', {name:inp.value});
        userFormArea.style.display = 'none';
        msgArea.style.display = 'block';
        console.log("You entered:",inp.value);
    }
    
});

var timeout = undefined;
msgBtn.addEventListener('click', function() {
    event.preventDefault();
    clearTimeout(timeout);
    typing = false;
    socket.emit('newMsg', msgInput.value);
    msgInput.value = '';
    socket.emit('typing', false);
});

// HANDLE KEYPRESS EVENT
var typing = false;

var timeoutFunc = function() {
    typing = false;
    clearTimeout(timeout);
    socket.emit('typing', false);
}
msgInput.addEventListener('keydown', function() {
    if(typing == false) {
        typing = true;
        socket.emit('typing', true);
        timeout = setTimeout(timeoutFunc, 2500);
    }
    else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunc, 2500);
    }
    
});

socket.on('usersUpdate', function(data) {
    let s = '';
    for(let i=0; i<data.length; i++) {
        s += '<li>' + data[i] + '</li>';
    }
    onlineUserArea.innerHTML = s;
});

socket.on('RecOtherMsg', function(data) {
    let ss = '';
    if(data.name == name) {
        ss = '<div class="roww"><div class="col1"></div><div class="col2"><div class="msssg msssg-color-me msssg-align-right"><p class="texxt texxt-color-me">'+data.msg+'</p></div></div></div>';
    }
    else {
        ss = '<div class="roww"><div class="col2"><div class="msssg msssg-color msssg-align-left"><p class="texxt texxt-color">'+data.msg+'</p></div></div><div class="col1"></div></div>';
    }
    
    // s = '<p class="grey-text text-darken-3 lighten-3" id="chatBox"><strong>' + data.name + ': </strong>' + data.msg + '</p>';
    chatArea.innerHTML += ss;
});

// HANDLE TYPING RECEIPT
// socket.on('typing', function(data) {
//     console.log(data, 'is typing');
    
// });

socket.on('typingUsersUpdate', function(data) {
    let s = '';
    // data.splice(data.indexOf(name), 1);
    /*if(data.length == 1 && data[i]==name) {
        s = '';
    }
    else if(data.length > 0) {
        s += '<p class="grey-text text-darken-3 lighten-3"><em>';
        for(let i=0; i<data.length; i++) {
            if(data[i] != name) {
                s += data[i];
                if(i != (data.length-1)){
                    s += ', ';
                }
            }
        }
        if(data.length == 1) {
            s += ' ';
        }
        s += 'is typing</em></p>'
    }
    feedback.innerHTML = s;*/
    if(data.length == 1 && data[0]==name) {
        s = '';
    }
    else if(data.length > 0) {
        let isFirst = true;
        s += '<p class="grey-text text-darken-3 lighten-3" id="fback"><em>';
        for(let i=0; i<data.length; i++) {
            if(data[i] != name) {
                if(isFirst == false) {
                    s += ', ';
                }
                else {
                    isFirst = false;
                }
                s += data[i];
            }
        }
        s += ' is typing</em></p>';
    }
    feedback.innerHTML = s;


});

// if(data.length == 1 && data[0]==name) {
//     s = '';
// }
// else if(data.length > 0) {
//     s += '<p class="grey-text text-darken-3 lighten-3"><em>';
//     for(let i=0; i<data.length; i++) {
//         if(data[i] != name) {
//             s += data[i];
//             if(i != data.length-1) {
//                 s += ', ';
//             }
//         }
//     }
//     s += ' is typing</em></p>';
// }
// feedback.innerHTML = s;