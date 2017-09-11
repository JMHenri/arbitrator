/**
 * Created by Jake-o on 9/8/2017.
 */



var Liqui = require('node.liqui.io');

// var apiSecret='c41e985a1af178823f9213e7cdf9febba54fa96d41f3cca53e4091a1d394767a'
// var apiKey='1A79T0T6-9VVNF43F-IOZGKJCZ-6F9SVTBI-JZL8CTQ5'

var apiSecret = '88b28dcb154fd545b69c166012ac8aaa02535722313ebdf49f1788bee4e758d2'
var apiKey = 'HL5GQ4EO-TBWB8NI5-QVESEF9R-42J6LDNB-AGOLTELH'

let liqui = new Liqui(apiKey, apiSecret);



//
// liqui.getInfo().then( result => {
//     console.log(result)
// });

liqui.ticker('eth_usdt').then( result => {
    console.log(result.eth_usdt.sell)
});