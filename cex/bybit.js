// file: fetchers/bybit.js
const axios = require('axios');

async function getBybitPrices(filter = null) {
  const url = 'https://api.bybit.com/v5/market/tickers?category=spot';
  const prices = {};
  try {
    const res = await axios.get(url);
    res.data.result.list.forEach(t => {
      if (t.symbol.endsWith('USDT')) {
        const base = t.symbol.replace('USDT', '');
        if (!filter || filter.includes(base)) {
          prices[base] = parseFloat(t.lastPrice);
        }
      }
    });
  } catch (e) {
    console.error('Bybit error:', e.message);
  }
  return prices;
}

module.exports = getBybitPrices;
