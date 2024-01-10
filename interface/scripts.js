// Global variables for WebSocket connections
var ws = null;
var ws2 = null;

// Function to set up the first WebSocket connection
function setupWebSocket() {
    ws = new WebSocket("ws://10.200.1.115:8081/net_analyzer");

    ws.onmessage = function(event) {
        var message = event.data;
        if (typeof message === 'string') {
            if (isResponse(message)) {
                displayResponse(message);
            } else {
                var data = message.split('" "');
                processMessage(data);
            }
        }
    };

    ws.onclose = function() {
        console.log("WebSocket connection closed");
    };
}

// Function to set up the second WebSocket connection
function setupWebSocket2() {
    ws2 = new WebSocket("ws://10.200.1.115:8081/find_client_id");

    ws2.onmessage = function(event) {
        var output = document.getElementById("fnd_id_output");
        output.innerHTML += event.data + "<br>";
        output.scrollTop = output.scrollHeight; // Auto-scroll to the bottom
    };

    ws2.onclose = function() {
        console.log("WebSocket2 connection closed");
    };
}

// Function to check if a message is a response
function isResponse(message) {
    return message.startsWith("Response:");
}

// Function to process and display the message data
function processMessage(data) {
    var table = document.getElementById("dataTable");
    if (!table) {
        createTable();
        table = document.getElementById("dataTable");
    }

    var tbody = table.getElementsByTagName('tbody')[0];
    var newRow = tbody.insertRow();

    data.forEach(function(column, index) {
        var newCell = newRow.insertCell();
        newCell.textContent = column.replace(/^"|"$/g, '');
        if (index === 1) {
            newCell.classList.add("clickable");
            newCell.addEventListener('click', function() {
                sendRequestWithSecondColumn(this.textContent);
            });
        }
    });

    var outputDiv = document.getElementById("ext_output");
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

// Function to create a new data table
function createTable() {
    var table = document.createElement('table');
    table.id = "dataTable";
    var thead = table.createTHead();
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    document.getElementById("ext_output").appendChild(table);
}

// Function to handle sending a message through the first WebSocket
function sendMessage() {
    var input = document.getElementById("inputField").value;
    var output = document.getElementById("ext_output");
    output.innerHTML = "";

    if (!ws || ws.readyState === WebSocket.CLOSED) {
        setupWebSocket();
    }

    waitForSocketConnection(ws, function() {
        ws.send(input);
    });
}

// Function to append text to the input field
function updateInput(text) {
    var inputField = document.getElementById("inputField");
    if (inputField) {
        inputField.value += text;
    } else {
        console.log("Input field not found");
    }
}

// Function to wait for a WebSocket connection before executing a callback
function waitForSocketConnection(socket, callback) {
    setTimeout(function() {
        if (socket.readyState === WebSocket.OPEN) {
            callback();
        } else {
            waitForSocketConnection(socket, callback);
        }
    }, 5);
}

// Function to handle sending a request with the client ID through the second WebSocket
function sendRequestWithSecondColumn(client_id) {
    if (!ws2 || ws2.readyState === WebSocket.CLOSED) {
        setupWebSocket2();
    }

    waitForSocketConnection(ws2, function() {
        var output = document.getElementById("fnd_id_output");
        output.innerHTML = "";
        ws2.send(client_id);
        console.log("Data sent to ws2: ", client_id);
    });
}

// Function to display the response in the designated output element
function displayResponse(responseData) {
    var responseOutput = document.getElementById("fnd_id_output");
    responseOutput.textContent = responseData;
}

// Function to close the first WebSocket connection
function stopWebSocket() {
    if (ws) {
        ws.close();
    }
}

// Function to close the second WebSocket connection
function stopWebSocket2() {
    if (ws2) {
        ws2.close();
    }
}

// Function to close all websocket connection
function stopWebSocketAll () {
    stopWebSocket
    stopWebSocket2
}

// Function to set up the first WebSocket connection on window load
window.onload = function() {
    setupWebSocket();
};
