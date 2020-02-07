run = function() {

    // $("#user_icon_content").click(function() {

    // });
    endpoint_online = 'ws://127.0.0.1:8000/new-user/' // 1

    var socket_online = new ReconnectingWebSocket(endpoint_online) // 2

    // 3

    socket_online.onopen = function(e) {
        console.log("open", e);
    }
    socket_online.onmessage = function(e) {
        var data = JSON.parse(e.data);
        console.log(data);
        for (id in data.html_user) {
            var user = data.html_user[id];
            var user_icon_id = 'user_icon_' + user[0];
            // console.log(user_icon_id);
            // console.log(data.html_user[user]);
            if (user[1] === true) {
                // console.log("reached here!");
                $("#" + user_icon_id).find("span").removeClass("status orange");
                $("#" + user_icon_id).find("span").addClass("status green");
            } else {
                $("#" + user_icon_id).find("span").removeClass("status green");
                $("#" + user_icon_id).find("span").addClass("status orange");
            }
        }

    }
    socket_online.onerror = function(e) {
        console.log("error", e);
    }
    socket_online.onclose = function(e) {
        console.log("close", e);
    }
};


// web_socket_func_1();
run();



$('li > *').click(function() {
    // console.log($(this).parent().attr('id'));
    var room_name = $(this).parent().attr('id');
    var user_1 = $("#user_1").text();
    // console.log(user_1);
    $("#user_2").html(room_name.substring(10));
    var user_2 = $("#user_2").text();
    // console.log(user_2);
    var room_name = ''
    if (user_1 > user_2) {
        room_name = 'room_' + user_2 + '_' + user_1;
    } else {
        room_name = 'room_' + user_1 + '_' + user_2;
    }
    // var endpoint_room = "ws://" + window.location.host + "/ws/chat/" + room_name + '/';
    var endpoint_room = "ws://" + window.location.host + "/ws/chat/" + room_name + "/";
    var socket_room = new ReconnectingWebSocket(endpoint_room);

    socket_room.onmessage = function(e) {
        var message = JSON.parse(e.data);
        console.log(message);
        $('#chat').append(make_message(user_1 == message.user, message.date, message.user, message.message));
    }
    socket_room.onopen = function(e) {
        console.log(e);
    }
    socket_room.onclose = function(e) {
        console.log(e);
    }
    socket_room.onerror = function(e) {
        console.log(e);
    }

    make_message = function(me, usernameIn, userID, message) {
        var date_text = '<h3>' + usernameIn + '</h3>';
        var username_text = '<h2>' + userID + '</h2>';
        var triangle = '<div class="triangle"></div>';
        var mess_box = '<div class="message">' + message + '</div>';
        return '<li class=' + (me == true ? '"me"' : '"you"') + '><div class="entete">' + date_text +
            username_text + triangle + mess_box + '</div></li>';

    }


    $('#send_chat').click(function() {
        socket_room.send(JSON.stringify({
            'message': $('#chat_input').val(),
            'user': $('header h2 p').text(),
            'date': Date(Date.now()).toString(),
        }));
    });
});