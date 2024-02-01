$(document).ready(function() {
    // Create a new WebSocket connection
    var socket = new WebSocket('ws://10.200.1.115:8081/auto_diagnose');

    // When the WebSocket connection is open
    socket.onopen = function() {
        console.log("WebSocket connection opened");
    };

    // When a message is received from the WebSocket
    socket.onmessage = function(event) {
        var response = event.data;
        
        // Parse response XML
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(response, "text/xml");

        // Get data from XML
        var test = xmlDoc.getElementsByTagName("TEST")[0].childNodes[0].nodeValue;
        var msg = xmlDoc.getElementsByTagName("MSG")[0].childNodes[0].nodeValue;
        var result = xmlDoc.getElementsByTagName("RESULT")[0].childNodes[0].nodeValue;

        // Decode Base64
        test = atob(test);
        msg = atob(msg);
        result = atob(result);

        // Remove trailing new line
        test = test.replace(/\n$/, '');
        msg = msg.replace(/\n$/, '');
        result = result.replace(/\n$/, '');
        
        // Convert new line in message to HTML
        msg = msg.replace(/\n/g, '<br>');


        // Log the result with datatype
        console.log('Test: ' + test + ' - ' + typeof test);
        console.log('Message: ' + msg + ' - ' + typeof msg);
        console.log('Result: ' + result + ' - ' + typeof result);

        // Create accordion element
        var accordion = document.createElement('div');
        accordion.className = 'w3-accordion w3-border';
        accordion.style.border = '2px solid';

        var button = document.createElement('button');
        button.className = 'w3-button w3-block w3-left-align';
        button.innerHTML = test;

        var panel = document.createElement('div');
        panel.className = 'w3-padding w3-light-grey w3-block w3-left-align';
        panel.innerHTML = msg;
        panel.style.display = 'none';
        
        button.addEventListener('click', function() {
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        });
        accordion.appendChild(button);
        accordion.appendChild(panel);

        // Set color based on result
        if (result == 'SUCCESS') {
            button.className += ' w3-green';
        } else {
            button.className += ' w3-red';
        }

        // Append accordion to the output
        $('#output').append(accordion);
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
