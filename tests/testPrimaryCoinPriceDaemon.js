/**
 * Created by Jake-o on 8/25/2017.
 */
var priceDaemon = require('../PrimaryCoinPriceDaemon.js');

function testPriceGet(){
    var priceGetter = new priceDaemon();
    setInterval( function(){
        console.log(priceGetter.getBitcoinPrice())
    },3000)

}


testPriceGet();