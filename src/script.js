(function () {
    window.addEventListener('message', function (e) {
        if (e.data.type === 'settings' && e.data.data !== undefined) {
            try {
                settings = JSON.parse(e.data.data);
            } catch (err) {
                console.log(err);
            }

        }
    });
    let host = window.location.host;
    let settings = {};

    var OrigWebSocket = window.WebSocket;
    var callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);
    var wsAddListener = OrigWebSocket.prototype.addEventListener;
    wsAddListener = wsAddListener.call.bind(wsAddListener);
    window.WebSocket = function WebSocket(url, protocols) {
        var ws;
        if (!(this instanceof WebSocket)) {
            // Called without 'new' (browsers will throw an error).
            ws = callWebSocket(this, arguments);
        } else if (arguments.length === 1) {
            ws = new OrigWebSocket(url);
        } else if (arguments.length >= 2) {
            ws = new OrigWebSocket(url, protocols);
        } else { // No arguments (browsers will throw an error)
            ws = new OrigWebSocket();
        }

        wsAddListener(ws, 'message', function (event) {
            // TODO: Do something with event.data (received data) if you wish.
        });
        return ws;
    }.bind();
    window.WebSocket.prototype = OrigWebSocket.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;

    var wsSend = OrigWebSocket.prototype.send;
    wsSend = wsSend.apply.bind(wsSend);
    OrigWebSocket.prototype.send = function (data) {

        if (host.indexOf("instagram") !== -1 && settings.subscribed && settings['instagram'] === true) {
            let string = String.fromCharCode.apply(null, new Uint8Array(data));
            if (string.indexOf("indicate_activity") !== -1) {
                return;
            }
        }
        return wsSend(this, arguments);
    };
})();