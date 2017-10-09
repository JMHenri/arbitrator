
var request = require('request')
var Liqui = require('node.liqui.io');

//publicClient.getProducts(callback);
//all

var apiSecret = '83dd85b534b2371b8db5445510a8dd7115d11eb6e73a7db117812740833457c7';
var apiKey="4VNMI4N1-ZNNGVF7J-FYTZZ9RP-4TRCTLQ8-FP4L75I6";


let liqui = new Liqui(apiKey, apiSecret);



var currentWallet;

var WalletDaemon = (function () {
    setInterval(logWalletData, 10000);

    function WalletDaemon(parentDaemon) {
        var self = this;

        this.logLevel = 1;
        //this.parentDaemon = parentDaemon;

        //myVar = setInterval(this.walletUpdate, 3000, self);

    }


    WalletDaemon.prototype.walletUpdate = function() {
        liqui.getInfo().then(callback);

        function callback(stuff){
            currentWallet = stuff.funds;

        }
    };

    return WalletDaemon;


}());


function logWalletData(){
    liqui.getInfo().then(callback);

    function callback(stuff){
        console.log(JSON.stringify(stuff))

    }
}

module.exports = {WalletDaemon:WalletDaemon};
