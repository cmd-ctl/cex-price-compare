const axios = require('axios');

async function getOkxPrices(filter = null) {
  const prices = {};
  try {
    const res = await axios.get('https://www.okx.com/api/v5/market/tickers?instType=SPOT');
    res.data.data.forEach(t => {
      if (t.instId.endsWith('-USDT')) {
        const base = t.instId.replace('-USDT', '');
        if (!filter || filter.includes(base)) {
          prices[base] = parseFloat(t.last);
        }
      }
    });
  } catch (e) {
    console.error('OKX error:', e.message);
  }
  return prices;
}

module.exports = getOkxPrices;
