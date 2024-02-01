var socket = null;
var table = null;

var options = [
    { id: 1, text: 'record_id', description: 'A unique record identifier, to prevent duplication of records when imported into SQL databases.', selected: true },
    { id: 2, text: 'client_id', description: 'The internal SafeSquid ID associated with the present/ongoing connection.', selected: true },
    { id: 3, text: 'request_id', description: 'A unique ID for every request created in the present/ongoing connection to the web-server.', selected: true },
    { id: 4, text: 'date_time', description: 'The date and time when the HTTP request was sent. The fields in the date/time field are [DD/MMM/YYYY:hh:mm:ss], where DD is the day of the month, MMM is the month, YYYY is the year, hh is the hour, mm is the minute, ss is the seconds.', selected: true },
    { id: 5, text: 'elapsed_time', description: 'Length of time in milliseconds that current HTTP request used to complete the transaction.' },
    { id: 6, text: 'status', description: 'Numeric code indicating the success or failure of the HTTP request. This code is a server response to a browser\'s request.', selected: true },
    { id: 7, text: 'size', description: 'Numeric field indicating the data transferred in number of bytes as part of the HTTP request, not including the HTTP header.' },
    { id: 8, text: 'upload', description: 'Numeric field indicating the data transferred from webserver to client.' },
    { id: 9, text: 'download', description: 'Numeric field indicating the data transferred from client to webserver.' },
    { id: 10, text: 'bypassed', description: 'Boolean(TRUE/FALSE) value which indicates whether the current request was bypassed or not after blocked by SafeSquid filter.' },
    { id: 11, text: 'client_ip', description: 'The IP address of the requesting client.' },
    { id: 12, text: 'username', description: 'The username@client_ip, (or user ID) used by the client for authentication. If no value is present, "anonymous" is substituted.' },
    { id: 13, text: 'method', description: 'A method is part of HTTP request sent by client to the server.' },
    { id: 14, text: 'url', description: 'An HTTP url is a reference to a web resource that specifies its location on a computer network and a mechanism for retrieving it.', selected: true },
    { id: 15, text: 'http_referer', description: 'An HTTP header field that identifies the address of the webpage that linked to the resource being requested. "-" is substituted when there is no referrer in HTTP header field.' },
    { id: 16, text: 'useragent', description: 'User agent are the client which initiates a request. User agents are often browsers, editors, spiders (web-traversing robots), or other end user tools.' },
    { id: 17, text: 'mime', description: 'Mime-type(media type) are used to identify the format of a file and format contents transmitted on the Internet.' },
    { id: 18, text: 'filter_name', description: 'Filter name due to which the request was blocked. "-" is substituted when request is allowed.' },
    { id: 19, text: 'filtering_reason', description: 'If the request gets blocked, then a predefined reason for the blocked request will be set. "-" is substituted for unknown reasons and allowed requests.' },
    { id: 20, text: 'interface', description: 'Interface IP:PORT that received the request. This field is important when SafeSquid is listening on multiple IPs or Ports.' },
    { id: 21, text: 'cachecode', description: 'Cachecodes are access error codes set by SafeSquid during connection with TCP/UDP request.' },
    { id: 22, text: 'peercode', description: 'Peercode entry represents a code that explains how the request was handled, for example, by forwarding it to a peer, or returning the request to the source.' },
    { id: 23, text: 'peer', description: 'Peer represents the name of the host from which the object was requested. This host may be the origin site, a parent, or any other peer.' },
    { id: 24, text: 'request_host', description: 'Fully qualified domain name (FQDN) of the requested web-server.' },
    { id: 25, text: 'request_tld', description: 'Top-level domain name of the requested web-server.' },
    { id: 26, text: 'referer_host', description: 'The referrer is the URL of the HTTP resource that referred the user to the resource requested. "-" is substituted when there are no referrers.' },
    { id: 27, text: 'referer_tld', description: 'Top-level domain name of the referrer URL that referred the user to the resource requested. "-" is substituted when there are no referrers.' },
    { id: 28, text: 'range', description: 'Data transferred in number of bytes as part of the HTTP request which comes under SafeSquid predefined range.' },
    { id: 29, text: 'time_profiles', description: 'Comma separated list of Time profiles that categorize websites based on the time ranges. "" is substituted when no profiles are applied.' },
    { id: 30, text: 'user_groups', description: 'Comma separated list of User Group(s) to which this entry is applicable.' },
    { id: 31, text: 'request_profiles', description: 'Comma separated list of Request profiles that were applied to the request. "" is substituted when no request profiles are applied.' },
    { id: 32, text: 'application_signatures', description: 'Comma separated list of application signatures that were applied to the request.' },
    { id: 33, text: 'categories', description: 'Comma separated list of categories that were applied to the request. "" is substituted when no profiles are applied.' },
    { id: 34, text: 'response_profiles', description: 'Comma separated list of Response profiles that were applied to the request. "" is substituted when no response profiles are applied.' },
    { id: 35, text: 'upload_content_types', description: 'Comma separated list of Upload Content Type. "-" is substituted when no profiles are applied or content types are unknown.' },
    { id: 36, text: 'download_content_types', description: 'Comma separated list of Download Content Type. "-" is substituted when no profiles are applied or content types are unknown.' },
    { id: 37, text: 'profiles', description: 'Comma separated list of profiles that were applied to the request. "" is substituted when no profiles are applied.' },
];


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

$(document).ready(function() {

    setupColumnSelect();
    setupWebSocket();

    $('#add_filter_row').click(function() {

        // Create select for column options
        var columnSelect = $('<select>');
    
        columnSelect.select2({
            data: options,
        });

        // Create select for conditions
        var conditionSelect = $('<select>');
        conditionSelect.append($('<option>').text('Matches with'));
        conditionSelect.append($('<option>').text('Does not match with'));

        conditionSelect.select2();
        
        // Create input for pattern
        var patternInput = $('<input type="text">');

        // Create new row
        var newRow = $('<div class="w3-row-padding">').append(
            $('<div class="w3-col s3">').append(columnSelect),
            $('<div class="w3-col s3">').append(conditionSelect),
            $('<div class="w3-col s6">').append(patternInput)
        );

        // Append new row to filter table
        $('#filter_table').append(newRow);
    });
    
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
