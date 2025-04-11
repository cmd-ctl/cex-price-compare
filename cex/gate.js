const axios = require('axios');
const https = require('https');

async function getGatePrices(filter = null) {
  const prices = {};
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const res = await axios.get('https://api.gate.io/api/v4/spot/tickers', { httpsAgent: agent });
    res.data.forEach(t => {
      if (t.currency_pair.endsWith('_USDT')) {
        const base = t.currency_pair.replace('_USDT', '');
        if (!filter || filter.includes(base)) {
          prices[base] = parseFloat(t.last);
        }
      }
    });
  } catch (e) {
    console.error('Gate.io error:', e.message);
  }

  return prices;
}

module.exports = getGatePrices;
