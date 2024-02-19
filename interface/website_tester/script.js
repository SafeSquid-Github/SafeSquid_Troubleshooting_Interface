function showCopiedMessage(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '&#10003; Copied!';
    button.disabled = true;
  
    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    }, 2000); // Show "Copied" for 2 seconds
}
  

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

        console.log(xmlDoc);

        // Get data from XML
        var test = xmlDoc.getElementsByTagName("TEST")[0].childNodes[0].nodeValue;
        var info = xmlDoc.getElementsByTagName("INFO")[0].childNodes[0].nodeValue;
        var cmd = xmlDoc.getElementsByTagName("COMMAND")[0].childNodes[0].nodeValue;
        var msg = xmlDoc.getElementsByTagName("MSG")[0].childNodes[0].nodeValue;
        var result = xmlDoc.getElementsByTagName("RESULT")[0].childNodes[0].nodeValue;

        // Decode Base64
        test = atob(test);
        info = atob(info);
        cmd = atob(cmd);
        msg = atob(msg);
        result = atob(result);

        // Remove trailing new line
        test = test.replace(/\n$/, '');
        info = info.replace(/\n$/, '');
        cmd = cmd.replace(/\n$/, '');
        msg = msg.replace(/\n$/, '');
        result = result.replace(/\n$/, '');
        
        // Convert new line in message to HTML
        msg = msg.replace(/\n/g, '<br>');

        // Log the result with datatype
        console.log('Test: ' + test + ' - ' + typeof test);
        console.log('Info: ' + info + ' - ' + typeof info);
        console.log('Command: ' + cmd + ' - ' + typeof cmd);
        console.log('Message: ' + msg + ' - ' + typeof msg);
        console.log('Result: ' + result + ' - ' + typeof result);

        // Create accordion element
        var accordion = document.createElement('div');
        accordion.className = 'w3-accordion w3-section w3-border w3-round';

        var test_dom = document.createElement('button');
        test_dom.className = 'w3-button w3-block w3-left-align accordion-header';
        test_dom.innerHTML = test;

        var panel = document.createElement('div');
        panel.className = 'w3-padding w3-light-grey w3-block w3-left-align';
        panel.style.display = 'none';

        var info_dom = document.createElement('p');
        info_dom.innerHTML = info;
        panel.appendChild(info_dom);

        var cmd_out_div = document.createElement('div');
        cmd_out_div.className = "code-output-container";
        
        var cmd_div = document.createElement('div');
        cmd_div.className = "code-container";
        
        var code_dom = document.createElement('code');
        code_dom.innerHTML = cmd;
        
        var copy_button = document.createElement('button');
        copy_button.innerHTML = "Copy";
        copy_button.className = "copy_buttton"

        cmd_div.appendChild(code_dom);
        cmd_div.appendChild(copy_button);

        
        var out_div = document.createElement('div');
        out_div.className = "output-container";

        var msg_dom = document.createElement('pre');
        msg_dom.innerHTML = msg;
        out_div.appendChild(msg_dom);
        
        cmd_out_div.appendChild(cmd_div);
        cmd_out_div.appendChild(out_div);
        
        panel.appendChild(cmd_out_div);

        copy_button.addEventListener('click', function() {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(cmd).then(() => {
                    showCopiedMessage(copy_button); // Call function to show "Copied" message
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            } else {
                // Fallback for older browsers or in case the clipboard API is not available
                console.error('Clipboard API not available.');
            }
        });
        test_dom.addEventListener('click', function() {
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        });
        accordion.appendChild(test_dom);
        accordion.appendChild(panel);

        // Set color based on result
        if (result == 'SUCCESS') {
            test_dom.className += ' w3-text-green';
        } else {
            test_dom.className += ' w3-text-red';
        }

        // Append accordion to the output
        $('#output').append(accordion);
    };

    $('#test_website').click(function() {
        $('#output').empty();

        var protocol = $('#protocol-toggle').prop('checked') ? 'https://' : 'http://';
        var website = $('#website').val();
        
        var url = protocol + website;
        console.log("Testing " + url);

        socket.send(url);
    });

    socket.onclose = function() {
        console.log("WebSocket connection closed");
    };
});
