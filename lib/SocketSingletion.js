const socket = require('socket.io');

const SocketSingleton = (function() {
    this.io = null;
    this.configure = function(server) {
        this.io = socket(server);
    };

    return this;
})();

module.exports = SocketSingleton;