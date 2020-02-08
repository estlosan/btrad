const { buy, sell } = require('./paperTrading.js');

/*

let strategyData = require(path.resolve(__dirname, `./strategies/${strategyName}/strategy.js`));

// tests/part1/cart-summary-test.js
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var CartSummary = require('./../../src/part1/cart-summary');

describe('CartSummary', function() {
  it('getSubtotal() should return 0 if no items are passed in', function() {
    var cartSummary = new CartSummary([]);
    expect(cartSummary.getSubtotal()).to.equal(0);
  });
});

for (let i = 0; i < ){

} */
let paperTrading = {};
paperTrading.initialMoney = 1000;
paperTrading.money = 1000;     //quantity*price=money
paperTrading.quantity = 0;
paperTrading.state = 'initial';

let strategyName = 'crossLines';


let lookback = []

candleClose = [0.001964, 0.0019656, 0.0019664, 0.0019649, 0.0019646, 0.0019658, 0.0019647, 0.0019658, 0.0019641, 0.0019616, 0.0019643, 0.0019634, 
  0.0019618, 0.0019624, 0.0019626, 0.0019616, 0.0019618, 0.0019615, 0.0019622, 0.0019623, 0.0019623, 0.0019633, 0.0019634, 0.0019625, 0.0019626, 0.0019613, 
  0.0019619, 0.0019607, 0.0019598, 0.0019611, 0.0019596, 0.0019598, 0.001959, 0.0019575, 0.0019571, 0.0019589, 0.0019586, 0.0019588, 0.0019587, 0.0019575, 
  0.0019597, 0.0019604, 0.0019599, 0.0019641, 0.0019619, 0.0019612, 0.0019623, 0.00196, 0.0019585, 0.0019581, 0.0019592, 0.0019585, 0.0019585, 0.0019575, 
  0.0019593, 0.001959, 0.0019627, 0.0019618, 0.001962, 0.0019627, 0.0019628, 0.0019631, 0.0019633, 0.0019634, 0.0019639, 0.0019661, 0.0019682, 0.0019718, 
  0.0019728, 0.0019739, 0.0019732, 0.001972, 0.0019738, 0.0019729, 0.00197, 0.0019715, 0.001971, 0.0019702, 0.0019707, 0.0019714, 0.0019697, 0.0019693, 
  0.0019699, 0.0019687, 0.0019687, 0.0019692, 0.0019678, 0.0019683, 0.0019689, 0.0019679, 0.0019693, 0.0019682, 0.0019666, 0.0019671, 0.0019678, 0.001969, 
  0.0019667, 0.0019674, 0.0019685] //El primero es el más actual

for (let i = 0; i < candleClose.length; i++){
  lookback.push(
    {
      close: candleClose[i]
    }
  );
}

let actualCandle = {close: 0.0019639};

buy(paperTrading, candleClose[1])
console.log(sell(paperTrading, candleClose[0]))
console.log(paperTrading.money)
