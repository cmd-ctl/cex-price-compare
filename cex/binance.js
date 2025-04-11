const axios = require('axios');

async function getBinancePrices(filter = null) {
  const url = 'https://api.binance.com/api/v3/ticker/price';
  const prices = {};
  try {
    const res = await axios.get(url);
    res.data.forEach(t => {
      if (t.symbol.endsWith('USDT')) {
        const base = t.symbol.replace('USDT', '');
        if (!filter || filter.includes(base)) {
          prices[base] = parseFloat(t.price);
        }
      }
    });
  } catch (e) {
    console.error('Binance error:', e.message);
  }
  return prices;
}

module.exports = getBinancePrices;
