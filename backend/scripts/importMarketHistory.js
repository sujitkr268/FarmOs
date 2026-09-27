const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
[
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend', '.env'),
  path.resolve(__dirname, '..', '.env')
].forEach((envPath) => {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
});

const { connectDB, pool } = require('../config/db');
const { createMarketPriceHistoryTable, insertHistoricalRecord } = require('../models/MarketPriceHistory');

const STATE_NORMALIZATION = {
  'west bengal': 'West Bengal',
  'maharashtra': 'Maharashtra',
  'punjab': 'Punjab',
  'uttar pradesh': 'Uttar Pradesh',
  'karnataka': 'Karnataka',
  'gujarat': 'Gujarat',
  'tamil nadu': 'Tamil Nadu',
  'haryana': 'Haryana',
  'bihar': 'Bihar',
  'madhya pradesh': 'Madhya Pradesh',
  'kerala': 'Kerala',
  'andhra pradesh': 'Andhra Pradesh',
  'telangana': 'Telangana',
  'assam': 'Assam',
  'odisha': 'Odisha',
  'rajasthan': 'Rajasthan'
};

const COMMODITY_NORMALIZATION = {
  'potato': 'Potato', 'potatoes': 'Potato', 'آلو': 'Potato', 'आलू': 'Potato', 'আলু': 'Potato',
  'tomato': 'Tomato', 'tomatoes': 'Tomato', 'टमाटर': 'Tomato', 'টমেটো': 'Tomato',
  'rice': 'Rice', 'paddy': 'Rice', 'चावल': 'Rice', 'धान': 'Rice', 'ধান': 'Rice',
  'wheat': 'Wheat', 'गेहूं': 'Wheat', 'गम': "Wheat",
  'onion': 'Onion', 'onions': 'Onion', 'प्याज': 'Onion', 'পেঁয়াজ': 'Onion',
  'jute': 'Jute', 'पटसन': 'Jute', 'পাট': 'Jute',
  'mustard': 'Mustard', 'सरसों': 'Mustard', 'সরষে': 'Mustard',
  'tea': 'Tea', 'चाय': 'Tea', 'চা': 'Tea',
  'brinjal': 'Brinjal', 'brinjals': 'Brinjal', 'eggplant': 'Brinjal', 'eggplants': 'Brinjal',
  'maize': 'Maize', 'corn': 'Maize', 'मक्का': 'Maize',
  'mango': 'Mango', 'mangoes': 'Mango'
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const str = String(dateStr).trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  const timestamp = Date.parse(str);
  if (!isNaN(timestamp)) {
    return new Date(timestamp).toISOString().split('T')[0];
  }

  return null;
};

const importMarketHistory = async () => {
  console.log('=================================================');
  console.log('    IMPORTING HISTORICAL MANDI MARKET DATA       ');
  console.log('=================================================\n');

  try {
    await connectDB();
    await createMarketPriceHistoryTable();

    const dataPath = path.resolve(__dirname, '..', 'data', 'historical_agmarknet_data.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found at: ${dataPath}`);
    }

    const rawContent = fs.readFileSync(dataPath, 'utf-8');
    const rawRecords = JSON.parse(rawContent);

    let stats = {
      recordsRead: rawRecords.length,
      validRecords: 0,
      rejectedRecords: 0,
      insertedRecords: 0,
      duplicateRecords: 0
    };

    const seenKeys = new Set();

    for (const item of rawRecords) {
      // 1. Parse date
      const arrivalDate = parseDate(item.arrival_date);
      if (!arrivalDate) {
        stats.rejectedRecords++;
        continue;
      }

      // 2. Normalize State
      const rawState = (item.state || '').toLowerCase().trim();
      const state = STATE_NORMALIZATION[rawState] || (item.state ? item.state.trim() : '');
      if (!state) {
        stats.rejectedRecords++;
        continue;
      }

      // 3. Normalize Commodity
      const rawCommodity = (item.commodity || '').toLowerCase().trim();
      const commodity = COMMODITY_NORMALIZATION[rawCommodity] || (item.commodity ? item.commodity.trim() : '');
      if (!commodity) {
        stats.rejectedRecords++;
        continue;
      }

      // 4. Validate Market & Prices
      const market = (item.market || item.district || '').trim();
      const minPrice = parseFloat(item.min_price || item.minPrice || 0);
      const maxPrice = parseFloat(item.max_price || item.maxPrice || 0);
      let modalPrice = parseFloat(item.modal_price || item.modalPrice || 0);

      if (!market || isNaN(modalPrice) || modalPrice <= 0) {
        stats.rejectedRecords++;
        continue;
      }

      // 5. Normalize Price Unit to ₹/quintal
      let priceUnit = '₹/quintal';
      const rawUnit = (item.price_unit || item.unit || '').toLowerCase();
      if (rawUnit.includes('kg') && !rawUnit.includes('quintal')) {
        modalPrice = modalPrice * 100;
        priceUnit = '₹/quintal';
      }

      // Record key for duplicate tracking
      const recordKey = `${arrivalDate}_${state.toLowerCase()}_${market.toLowerCase()}_${commodity.toLowerCase()}_${(item.variety || 'FAQ').toLowerCase()}`;

      if (seenKeys.has(recordKey)) {
        stats.duplicateRecords++;
        continue;
      }
      seenKeys.add(recordKey);

      stats.validRecords++;

      const normalizedRecord = {
        arrival_date: arrivalDate,
        state: state,
        district: (item.district || state).trim(),
        market: market,
        commodity: commodity,
        variety: (item.variety || 'FAQ').trim(),
        grade: (item.grade || 'FAQ').trim(),
        min_price: minPrice > 0 ? minPrice : modalPrice,
        max_price: maxPrice > 0 ? maxPrice : modalPrice,
        modal_price: modalPrice,
        price_unit: priceUnit,
        source: item.source || 'Agmarknet'
      };

      const inserted = await insertHistoricalRecord(normalizedRecord);
      if (inserted) {
        stats.insertedRecords++;
      } else {
        stats.duplicateRecords++;
      }
    }

    console.log('-------------------------------------------------');
    console.log(`📊 Import Summary:`);
    console.log(`   - Records Read:      ${stats.recordsRead}`);
    console.log(`   - Valid Records:     ${stats.validRecords}`);
    console.log(`   - Rejected Records:  ${stats.rejectedRecords}`);
    console.log(`   - Inserted Records:  ${stats.insertedRecords}`);
    console.log(`   - Duplicate Records: ${stats.duplicateRecords}`);
    console.log('-------------------------------------------------\n');

  } catch (err) {
    console.error('Import failed:', err.message);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  importMarketHistory();
}

module.exports = { importMarketHistory };
