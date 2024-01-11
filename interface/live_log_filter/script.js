var socket = null;
var table = null;

function setupWebSocket() {
    socket = new WebSocket('ws://10.200.1.115:8081/net_analyzer');

    // When the WebSocket connection is open
    socket.onopen = function() {
        console.log("WebSocket connection opened");
    };

    // When a message is received from the WebSocket
    socket.onmessage = function(event) {
        var response = event.data;

        // Split the response into an array
        var data = response.split('" "');

        // Create an object from the array
        var row = {
            date: data[0].replace(/"/g, ''),
            id: data[1],
            status: data[2],
            ip: data[3],
            user: data[4],
            protocol: data[5],
            url: data[6],
            category: data[7].replace(/"/g, '')
        };

        // Add the new row to the table
        table.row.add(row).draw();

        // Append the response to the output with a <br> tag
        // $('#logs').append(response + '<br>');
    };
    
    socket.onclose = function() {
        console.log("WebSocket connection closed");
    };

}

$(document).ready(function() {

    setupWebSocket();
    
    $('#start_monitor').click(function() {
        $('#log_table').empty();
        
        $('#stop_monitor').show();
        $('#start_monitor').hide();

        var filter = $('#filter').val();

        table = $('#log_table').DataTable({
            columns: [
                { data: 'date' },
                { data: 'id' },
                { data: 'status' },
                { data: 'ip' },
                { data: 'user' },
                { data: 'protocol' },
                { data: 'url' },
                { data: 'category' }
            ],
            columnDefs: [
                { title: "Date", targets: 0 },
                { title: "Client ID", targets: 1 },
                { title: "Status", targets: 2 },
                { title: "IP", targets: 3 },
                { title: "User", targets: 4 },
                { title: "Cachecode", targets: 5 },
                { title: "Domain", targets: 6 },
                { title: "Category", targets: 7 }
            ],
            order: [[0, 'desc']]
        });

        if (!socket || socket.readyState === WebSocket.CLOSED) {
            setupWebSocket();
        }
        socket.send(filter);
    });
    
    $('#stop_monitor').click(function() {
        $('#stop_monitor').hide();
        $('#start_monitor').show();

        table.destroy();
        $('#log_table').empty();
        
        socket.close();
    });

});
