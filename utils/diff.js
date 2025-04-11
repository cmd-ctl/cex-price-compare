function calculatePriceDiff(PERCENT, exchPrice) {
    const tokenSet = new Set();
  
    for (const exchange in exchPrice) {
      for (const token in exchPrice[exchange]) {
        tokenSet.add(token);
      }
    }
  
    const diffs = [];
  
    for (const token of tokenSet) {
      const tokenPrices = [];
  
      for (const [exchange, data] of Object.entries(exchPrice)) {
        const entry = data[token];
        if (entry && typeof entry.price === 'number') {
          tokenPrices.push({ name: exchange, price: entry.price });
        }
      }
  
      if (tokenPrices.length < 2) continue;
  
      const prices = tokenPrices.map(p => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const diffPercent = ((max - min) / min) * 100;
  
      if (diffPercent >= PERCENT || PERCENT === 0) {
        diffs.push({
          symbol: token,
          diffPercent,
          min,
          max,
          exchanges: tokenPrices
        });
      }
    }
  
    return diffs;
  }
  
  module.exports = calculatePriceDiff;
  