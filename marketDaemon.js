var https = require('https');
var events = require('events');





var MarketDaemon = (function () {
    var marketEmitter = new events.EventEmitter();
    marketEmitter.on('do', eventHandler);
    function MarketDaemon(parentDaemon) {
        var self = this;
        this.parentDaemon = parentDaemon;


    }


    return MarketDaemon;
})()






module.exports = {
    manager: MarketDaemon
};