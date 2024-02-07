var socket = null;
var table = null;

var options = [
    { id: 1, text: 'Record ID', description: 'A unique record identifier, to prevent duplication of records when imported into SQL databases.', selected: true },
    { id: 2, text: 'Client ID', description: 'The internal SafeSquid ID associated with the present/ongoing connection.', selected: true },
    { id: 3, text: 'Request ID', description: 'A unique ID for every request created in the present/ongoing connection to the web-server.', selected: true },
    { id: 4, text: 'Date Time', description: 'The date and time when the HTTP request was sent. The fields in the date/time field are [DD/MMM/YYYY:hh:mm:ss], where DD is the day of the month, MMM is the month, YYYY is the year, hh is the hour, mm is the minute, ss is the seconds.', selected: true },
    { id: 5, text: 'Elapsed Time', description: 'Length of time in milliseconds that current HTTP request used to complete the transaction.' },
    { id: 6, text: 'Status', description: 'Numeric code indicating the success or failure of the HTTP request. This code is a server response to a browser\'s request.', selected: true },
    { id: 7, text: 'Size', description: 'Numeric field indicating the data transferred in number of bytes as part of the HTTP request, not including the HTTP header.' },
    { id: 8, text: 'Upload', description: 'Numeric field indicating the data transferred from webserver to client.' },
    { id: 9, text: 'Download', description: 'Numeric field indicating the data transferred from client to webserver.' },
    { id: 10, text: 'Bypassed', description: 'Boolean(TRUE/FALSE) value which indicates whether the current request was bypassed or not after blocked by SafeSquid filter.' },
    { id: 11, text: 'Client IP', description: 'The IP address of the requesting client.' },
    { id: 12, text: 'Username', description: 'The username@client_ip, (or user ID) used by the client for authentication. If no value is present, "anonymous" is substituted.' },
    { id: 13, text: 'Method', description: 'A method is part of HTTP request sent by client to the server.' },
    { id: 14, text: 'URL', description: 'An HTTP url is a reference to a web resource that specifies its location on a computer network and a mechanism for retrieving it.', selected: true },
    { id: 15, text: 'HTTP Referer', description: 'An HTTP header field that identifies the address of the webpage that linked to the resource being requested. "-" is substituted when there is no referrer in HTTP header field.' },
    { id: 16, text: 'User Agent', description: 'User agent are the client which initiates a request. User agents are often browsers, editors, spiders (web-traversing robots), or other end user tools.' },
    { id: 17, text: 'MIME', description: 'Mime-type(media type) are used to identify the format of a file and format contents transmitted on the Internet.' },
    { id: 18, text: 'Filter Name', description: 'Filter name due to which the request was blocked. "-" is substituted when request is allowed.' },
    { id: 19, text: 'Filter Reason', description: 'If the request gets blocked, then a predefined reason for the blocked request will be set. "-" is substituted for unknown reasons and allowed requests.' },
    { id: 20, text: 'Interface', description: 'Interface IP:PORT that received the request. This field is important when SafeSquid is listening on multiple IPs or Ports.' },
    { id: 21, text: 'Cache code', description: 'Cachecodes are access error codes set by SafeSquid during connection with TCP/UDP request.' },
    { id: 22, text: 'Peer code', description: 'Peercode entry represents a code that explains how the request was handled, for example, by forwarding it to a peer, or returning the request to the source.' },
    { id: 23, text: 'Peer', description: 'Peer represents the name of the host from which the object was requested. This host may be the origin site, a parent, or any other peer.' },
    { id: 24, text: 'Request Host', description: 'Fully qualified domain name (FQDN) of the requested web-server.' },
    { id: 25, text: 'Request TLD', description: 'Top-level domain name of the requested web-server.' },
    { id: 26, text: 'Referrer Host', description: 'The referrer is the URL of the HTTP resource that referred the user to the resource requested. "-" is substituted when there are no referrers.' },
    { id: 27, text: 'Referrer TLD', description: 'Top-level domain name of the referrer URL that referred the user to the resource requested. "-" is substituted when there are no referrers.' },
    { id: 28, text: 'Range', description: 'Data transferred in number of bytes as part of the HTTP request which comes under SafeSquid predefined range.' },
    { id: 29, text: 'Time Profiles', description: 'Comma separated list of Time profiles that categorize websites based on the time ranges. "" is substituted when no profiles are applied.' },
    { id: 30, text: 'User Groups', description: 'Comma separated list of User Group(s) to which this entry is applicable.' },
    { id: 31, text: 'Request Profiles', description: 'Comma separated list of Request profiles that were applied to the request. "" is substituted when no request profiles are applied.' },
    { id: 32, text: 'Application Signatures', description: 'Comma separated list of application signatures that were applied to the request.' },
    { id: 33, text: 'Categories', description: 'Comma separated list of categories that were applied to the request. "" is substituted when no profiles are applied.' },
    { id: 34, text: 'Response Profiles', description: 'Comma separated list of Response profiles that were applied to the request. "" is substituted when no response profiles are applied.' },
    { id: 35, text: 'Upload Content Types', description: 'Comma separated list of Upload Content Type. "-" is substituted when no profiles are applied or content types are unknown.' },
    { id: 36, text: 'Download Content Types', description: 'Comma separated list of Download Content Type. "-" is substituted when no profiles are applied or content types are unknown.' },
    { id: 37, text: 'Profiles', description: 'Comma separated list of profiles that were applied to the request. "" is substituted when no profiles are applied.' },
];


function setupWebSocket() {
    socket = new WebSocket('ws://10.200.1.115:8081/net_analyzer');

    // When the WebSocket connection is open
    socket.onopen = function() {
        console.log("WebSocket connection opened");
    };

    socket.onmessage = function(event) {
        var response = event.data;

        // Split the response into an array
        var data = response.split('" "');

        // For all data elements, remove the quotes
        for (var i = 0; i < data.length; i++) {
            data[i] = data[i].replace(/"/g, '');
        }

        // Create an object from the array
        // var row = {
        //     date: data[0].replace(/"/g, ''),
        //     id: data[1],
        //     status: data[2],
        //     ip: data[3],
        //     user: data[4],
        //     protocol: data[5],
        //     url: data[6],
        //     category: data[7].replace(/"/g, '')
        // };

        // Add the new row to the table
        table.row.add(row).draw();

        // Append the response to the output with a <br> tag
        // $('#logs').append(response + '<br>');
    };
    
    socket.onclose = function() {
        console.log("WebSocket connection closed");
    };

}

function setupColumnSelect(){

    $('#columns').select2({
        data: options,
        multiple: true,
        // templateResult: function (data) {
        //     // You can change this to match the structure of your data
        //     var description = data.description || '';
        //     return data.text + ' - ' + description;
        // },
    });
}

// Example of columns: Array(6) [ "1", "2", "3", "4", "6", "14" ]
// Example of filters: Array [ { column: 14, condition: "matches_with", pattern: "abcd" }, { column: 17, condition: "does_not_match_with", pattern: "html" } ]
// Example of return: -f $24~/google.com/&&$6~/200/ -c $2,$6,$11,$12,$21,$24,$33
function makeAwkCommand(columns, filters){
    console.log("Making awk command");
    console.log(columns);
    console.log(filters);

    var columnString = columns.map(function(column) {
        return '$' + column;
    }
    ).join(',');
    console.log(columnString);

    var filterString = filters.map(function(filter) {
        var condition = filter.condition === 'matches_with' ? '~' : '!~';
        return '$' + filter.column + condition + '/' + filter.pattern + '/';
    }).join('&&');
    console.log(filterString);

    var awkString = "-f '" + filterString + "' -c '" + columnString +"'";
    console.log(awkString);

    return awkString;
}

$(document).ready(function() {

    setupColumnSelect();
    setupWebSocket();

    $('#add_filter_row').click(function() {

        // Create select for column options
        var columnSelect = $('<select class="w3-select w3-center w3-input"></select>');

        // Create select for conditions
        var conditionSelect = $('<select class="w3-select w3-center w3-input"></select>');
        conditionSelect.append($('<option>').text('Matches with'));
        conditionSelect.append($('<option>').text('Does not match with'));
        
        // Create input for pattern
        var patternInput = $('<input type="text" class="w3-input w3-border">');

        // Add a delete button
        var deleteButton = $('<button class="w3-button w3-red">Delete</button>');
        deleteButton.click(function() {
            $(this).parent().parent().remove();
        });

        // Create new row
        var newRow = $('<div class="w3-row-padding">').append(
            $('<div class="w3-col s3">').append(columnSelect),
            $('<div class="w3-col s3">').append(conditionSelect),
            $('<div class="w3-col s5">').append(patternInput),
            $('<div class="w3-col s1">').append(deleteButton)
        );

        // Append new row to filter table
        $('#filter_table').append(newRow);

        columnSelect.select2({
            data: options,
        });
        conditionSelect.select2({
            minimumResultsForSearch: -1,
        });
    });
    
    $('#start_monitor').click(function() {
        $('#log_table').empty();
        
        $('#stop_monitor').show();
        $('#start_monitor').hide();
        
        var selected_cols = $('#columns').val();

        var selectedOptions = options.filter((option) => selected_cols.includes(option.id.toString()) );

        console.log("Selected columns");
        console.log(selected_cols);
        console.log(selectedOptions);

        var filters = [];

        // Iterate over each row of filters
        $('#filter_table .w3-row-padding').each(function() {
            // Get the column, condition, and pattern values
            var columnValue = $(this).find('select:eq(0)').find('option:selected').text();
            var conditionValue = $(this).find('select:eq(1)').find('option:selected').text().toLowerCase().replace(/\s+/g, '_');
            var patternValue = $(this).find('input[type="text"]').val();
            
            // Find option id for the column
            var columnId = options.find(function(option) {
                return option.text === columnValue;
            }).id;

            // Construct the filter object
            var filter = {
                "column": columnId,
                "condition": conditionValue,
                "pattern": patternValue
            };

            // Add the filter object to the array
            filters.push(filter);
        });

        table = $('#log_table').DataTable({
            columns: selectedOptions.map(function(option) {
                return { title: option.text};
            }),
            order: [[0, 'desc']]
        });

        var awk_command = makeAwkCommand(selected_cols, filters);

        if (!socket || socket.readyState === WebSocket.CLOSED) {
            setupWebSocket();
        }
        socket.send(awk_command);
    });
    
    $('#stop_monitor').click(function() {
        $('#stop_monitor').hide();
        $('#start_monitor').show();

        table.destroy();
        $('#log_table').empty();
        
        socket.close();
        setupWebSocket();
    });

});
