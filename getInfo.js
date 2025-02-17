/**
 * Created by Jake-o on 9/8/2017.
 */



var Liqui = require('node.liqui.io');


let liqui = new Liqui(apiKey, apiSecret);



//
// liqui.getInfo().then( result => {
//     console.log(result)
// });

liqui.ticker('eth_usdt').then( result => {
    console.log(result.eth_usdt.sell)
});
