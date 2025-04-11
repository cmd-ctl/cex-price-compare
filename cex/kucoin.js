const axios = require('axios');

async function getKucoinPrices(filter = null) {
  const prices = {};
  try {
    const res = await axios.get('https://api.kucoin.com/api/v1/market/allTickers');
    res.data.data.ticker.forEach(t => {
      if (t.symbol.endsWith('-USDT')) {
        const base = t.symbol.replace('-USDT', '');
        if (!filter || filter.includes(base)) {
          prices[base] = parseFloat(t.last);
        }
      }
    });
  } catch (e) {
    console.error('KuCoin error:', e.message);
  }
  return prices;
}

module.exports = getKucoinPrices;
