const getBybitPrices = require('./cex/bybit');
const getBinancePrices = require('./cex/binance');
const getMexcPrices = require('./cex/mexc');
const getKucoinPrices = require('./cex/kucoin');
const getGatePrices = require('./cex/gate');
const getOkxPrices = require('./cex/okx');
const calculatePriceDiff = require('./utils/diff');
const chalk = require('chalk');

const TARGET_TOKENS = ['ETH', 'TON', 'SOL', 'HOLD']; // null for all
const PERCENT = 0; // 0 for all

function extractBaseSymbol(symbol) {
  const match = symbol.match(/^([A-Z0-9]+)/i);
  return match ? match[1] : symbol;
}

function normalizeSymbols(prices) {
  const result = {};
  for (const [symbol, data] of Object.entries(prices)) {
    const base = extractBaseSymbol(symbol);
    if (!result[base]) {
      result[base] = typeof data === 'object' && data.price !== undefined
        ? data
        : { price: data };
    }
  }
  return result;
}

function ensureMinExchanges(pricesByExchange, minSources = 2) {
  const tokenCounts = {};
  for (const exchange in pricesByExchange) {
    for (const token in pricesByExchange[exchange]) {
      tokenCounts[token] = (tokenCounts[token] || 0) + 1;
    }
  }
  for (const exchange in pricesByExchange) {
    for (const token in pricesByExchange[exchange]) {
      if (tokenCounts[token] < minSources) {
        delete pricesByExchange[exchange][token];
      }
    }
  }
}

(async () => {
  const allPrices = {};
  allPrices['Bybit'] = normalizeSymbols(await getBybitPrices(TARGET_TOKENS));
  allPrices['Binance'] = normalizeSymbols(await getBinancePrices(TARGET_TOKENS));
  allPrices['MEXC'] = normalizeSymbols(await getMexcPrices(TARGET_TOKENS));
  allPrices['KuCoin'] = normalizeSymbols(await getKucoinPrices(TARGET_TOKENS));
  //allPrices['Gate.io'] = normalizeSymbols(await getGatePrices(TARGET_TOKENS));
  allPrices['OKX'] = normalizeSymbols(await getOkxPrices(TARGET_TOKENS));

  ensureMinExchanges(allPrices);

  const allDiffs = calculatePriceDiff(PERCENT, allPrices);

  if (TARGET_TOKENS === null && allDiffs.length === 0) {
    console.log('no price discrepancy found.');
    return;
  }

  allDiffs.forEach(item => {
    const baseSymbol = extractBaseSymbol(item.symbol);
    const percentInfo = ` (${item.diffPercent.toFixed(2)}%)`;

    if (TARGET_TOKENS !== null && !TARGET_TOKENS.includes(baseSymbol)) return;
    if (TARGET_TOKENS === null && item.diffPercent <= 0.01) return;

    console.log(chalk.bold(`\n${item.symbol}${percentInfo}`));
    
    item.exchanges.forEach(({ name, price }) => {
      if (typeof price !== 'number') {
        console.log(`  ${name}: N/A`);
        return;
      }

      const formatted = price.toFixed(10).replace('.', ',');

      if (price === item.min) {
        console.log(`  ${chalk.red(`${name}: ${formatted}`)}`);
      } else if (price === item.max) {
        console.log(`  ${chalk.green(`${name}: ${formatted}`)}`);
      } else {
        console.log(`  ${name}: ${formatted}`);
      }
    });
  });
})();
