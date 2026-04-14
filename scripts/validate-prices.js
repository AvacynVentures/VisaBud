#!/usr/bin/env node

/**
 * PRICE CONSISTENCY VALIDATOR
 * 
 * Ensures all price values are synchronized across:
 * - src/app/api/checkout/route.ts
 * - src/app/api/prices/route.ts
 * - src/lib/stripe.ts (if exists)
 * 
 * Run: node scripts/validate-prices.js
 * Or in package.json: "validate:prices": "node scripts/validate-prices.js"
 * 
 * Prevents inconsistent pricing bugs where one file updates but others don't.
 */

const fs = require('fs');
const path = require('path');

const PRICES_TO_CHECK = [
  {
    file: 'src/app/api/checkout/route.ts',
    pattern: /pricePence:\s*(\d+)/g,
    label: 'Checkout Route',
  },
  {
    file: 'src/app/api/prices/route.ts',
    pattern: /pricePence:\s*(\d+)/g,
    label: 'Prices Endpoint',
  },
  {
    file: 'src/lib/stripe.ts',
    pattern: /(?:VISABUD_PRICE_PENCE|pricePence)\s*[:=]\s*(\d+)/g,
    label: 'Stripe Config',
    optional: true,
  },
];

const expectedPrices = [31, 32, 33]; // Standard, Premium, Expert
const errors = [];
const warnings = [];
let filesChecked = 0;

console.log('🔍 Validating price consistency...\n');

PRICES_TO_CHECK.forEach(({ file, pattern, label, optional }) => {
  const filePath = path.join(__dirname, '..', file);

  if (!fs.existsSync(filePath)) {
    if (optional) {
      console.log(`⏭️  Skipped: ${label} (${file}) — not found (optional)`);
    } else {
      errors.push(`❌ MISSING: ${label} (${file})`);
    }
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [...content.matchAll(pattern)];

  if (matches.length === 0) {
    warnings.push(`⚠️  WARNING: No pricePence values found in ${label} (${file})`);
    return;
  }

  const foundPrices = matches.map(m => parseInt(m[1], 10)).sort((a, b) => a - b);
  const uniquePrices = [...new Set(foundPrices)].sort((a, b) => a - b);
  const expected = [...expectedPrices].sort((a, b) => a - b);

  filesChecked++;

  // Check if all expected prices are present (allow duplicates in same file)
  const isConsistent = expected.length === uniquePrices.length && 
    expected.every((price, i) => price === uniquePrices[i]);

  if (isConsistent) {
    console.log(`✅ ${label}: ${uniquePrices.join(', ')}p`);
  } else {
    errors.push(`❌ ${label}: Found [${uniquePrices.join(', ')}p], expected [${expected.join(', ')}p]`);
  }
});

console.log(`\n📊 Checked ${filesChecked} files\n`);

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  warnings.forEach(w => console.log(`   ${w}`));
  console.log();
}

if (errors.length > 0) {
  console.log('🚨 ERRORS:');
  errors.forEach(e => console.log(`   ${e}`));
  console.log('\n❌ VALIDATION FAILED\n');
  process.exit(1);
} else {
  console.log('✅ All prices consistent!\n');
  process.exit(0);
}
