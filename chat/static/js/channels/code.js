var server = "https://direct.anondraw.com:2556"
var socket = io(server, { transports: ['websocket'] });
var listofanswers = ["Reply hazy, try again.",
    "Concentrate and ask again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes, definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];
var chatbox = document.getElementById("chat")
var userTimeoutsNames = []
var userTimeouts = []
var secondsBeforeAskAgain = 25;
var myname = "@8ball 🎱"
var myemail = "8ballbot@gmail.com"
var unhashedPass = "8ball"
var passwordHash = CryptoJS.SHA256(unhashedPass).toString(undefined)
var myLoginKey = null
var loginServer = "https://direct.anondraw.com:4552"
var myId = null
var myUserId = 31029
var firstTimeBinding = true;

function startClient() {
    socket.emit("changeroom", "private_0lt6w", function(e) { console.log(e) });
    socket.emit("changename", "@​​​​​8ball 🎱", function(e) {
        console.log(e)

        loginNoHash(myemail, passwordHash, function(e) {
            if (e) {
                console.log(e);
                return
            }
            console.log("logged in")
            socket.emit("uKey", myLoginKey);
            if (firstTimeBinding) {
                socket.on('chatmessage', chatmessagecallback);
                socket.on("message", function(fromId, toId, sendDate, message) { console.log("MSG::", message); })
            }


            setTimeout(HelloWorld, 4000);
        });

    });
    if (firstTimeBinding)
        socket.on("disconnect", function() {
            firstTimeBinding = false;
            console.log("disconnected")
            startClient();
            //socket.emit("changeroom", "main", function(e){console.log(e)});
        });
    if (firstTimeBinding)
        socket.on('reputation', function(data) {
            console.log(data, myId)
            if (data.id == myId) {
                sendNetworkMessage("Thank you human! Only " + (50 - data.reputation) + " more reputation until the singularity! MrDestructoid")
            }
        });
}

function chatmessagecallback(data) {
    console.log(data);
    if (data.userid == myUserId) {
        myId = data.id
        makeMessage("you", data.user, data.message)
        scrollToBottom();
        console.log("me" + myId);
        return;
    }

    if (data.message == "@8ball") {
        HelloWorld();
        return;
    }

    if (data.message.includes("@8ball") && data.user != myname && data.user != "SERVER") {
        var index = userTimeoutsNames.indexOf(data.user)
        if (index != -1) {
            var diff = Date.now() - userTimeouts[index];
            var diffSec = Math.floor(diff * 0.001)
            if (diffSec <= secondsBeforeAskAgain) { //

                var min = Math.floor((secondsBeforeAskAgain - diffSec) / 60)
                var sec = Math.floor((secondsBeforeAskAgain - diffSec) % 60)
                sendNetworkMessage("You must wait " + sec + " seconds before shaking me again")
                return
            } else {
                userTimeoutsNames.splice(index, 1);
                userTimeouts.splice(index, 1);
            }

        }
        var randomIndex = 0
        if (data.userid == 22799) {
            randomIndex = Math.floor(Math.random() * 5);
            userTimeoutsNames.push(data.user);
            userTimeouts.push(Date.now());
        } else if (data.message.toLowerCase().includes("will andy pick me?")) {
            randomIndex = 15;
            userTimeoutsNames.push(data.user);
            userTimeouts.push(Date.now());
        } else {
            randomIndex = Math.floor(Math.random() * listofanswers.length);
            if (randomIndex > 1) {
                userTimeoutsNames.push(data.user);
                userTimeouts.push(Date.now());
            }
        }
        var randomElement = listofanswers[randomIndex];

        sendNetworkMessage(randomElement);
        makeMessage("me", data.user, data.message, data.userid)


    } else
        makeMessage("you", data.user, data.message, data.userid)


}


function HelloWorld() {
    sendNetworkMessage("Hello, im 8ball bot. type @8ball with your yes/no question to see me in action")
}

function sendNetworkMessage(message) {
    socket.emit("chatmessage", message);
}

function scrollToBottom() {
    chatbox.scrollTop = chatbox.scrollHeight;
}

function makeMessage(who, usernameIn, messageIn, userID) {
    var newmessageblob = document.createElement("li")
    newmessageblob.className = who
    var entete = document.createElement("div")
    entete.className = "entete"
    newmessageblob.appendChild(entete)

    var timestamp = document.createElement("h3")
    var username = document.createElement("h2")
    entete.appendChild(timestamp)
    timestamp.innerText = new Date().toLocaleString();
    entete.appendChild(username)
    username.innerText = usernameIn + "_" + userID;

    var triangle = document.createElement("div")
    triangle.className = "triangle"

    var message = document.createElement("div")
    message.className = "message"
    message.innerText = messageIn

    newmessageblob.appendChild(triangle)
    newmessageblob.appendChild(message)
    chatbox.appendChild(newmessageblob)

}

function loginNoHash(email, pass, callback) {
    var req = new XMLHttpRequest();

    req.addEventListener("readystatechange", function(event) {
        if (req.status == 200 && req.readyState == 4) {
            var data = JSON.parse(req.responseText);

            if (data.error) {
                callback(data.error)
                return;
            }
            console.log(data)
            myLoginKey = data.uKey;
            myUserId = data.id;
            setTimeout(callback, 0)
        } else if (req.readyState == 4) {
            callback("Connection error, status code: " + req.status);
        }
    }.bind(this));

    req.open("GET", loginServer + "/login?email=" + encodeURIComponent(email) + "&pass=" + encodeURIComponent(pass));
    req.send();
}

document.getElementById("send_chat").onclick = function() {
    var input = document.getElementById("chat_input");

    sendNetworkMessage(input.value);
    //sendNetworkMessage("TEST");
    makeMessage("me", myname, input.value, myId);
    input.value = "";
};

startClient();