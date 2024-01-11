$(document).ready(function() {
    // Create a new WebSocket connection
    var socket = new WebSocket('ws://10.200.1.115:8081/auto_diagonse');

    // When the WebSocket connection is open
    socket.onopen = function() {
        console.log("WebSocket connection opened");
    };

    // When a message is received from the WebSocket
    socket.onmessage = function(event) {
        var response = event.data;

        // Append the response to the output with a <br> tag
        $('#output').append(response + '<br>');
    };

    $('#test_website').click(function() {
        $('#output').empty();

        var protocol = $('#protocol').val();
        var website = $('#website').val();
        
        var url = protocol + website;

        socket.send(url);
    });

    socket.onclose = function() {
        console.log("WebSocket connection closed");
    };
});
