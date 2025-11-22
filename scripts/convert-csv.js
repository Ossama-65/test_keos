#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to CSV file
const csvPath = path.join(__dirname, '..', '..', 'scripts', 'prospects_prospection_ready.csv');
const jsonPath = path.join(__dirname, '..', 'public', 'data', 'prospects.json');

function csvToJson(csvData) {
  const lines = csvData.split('\n');
  if (lines.length < 2) {
    console.error('CSV file is empty or invalid');
    return [];
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const prospects = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const prospect = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + i,
    };

    headers.forEach((header, index) => {
      prospect[header] = values[index] || '';
    });

    // Convert score to number
    prospect.score = parseInt(prospect.score) || 0;

    prospects.push(prospect);
  }

  return prospects;
}

try {
  console.log('Converting CSV to JSON...');
  console.log('CSV path:', csvPath);
  
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found:', csvPath);
    console.log('Creating empty prospects file...');
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify([], null, 2));
    console.log('Empty prospects file created at:', jsonPath);
    process.exit(0);
  }

  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const prospects = csvToJson(csvData);

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });

  // Write JSON file
  fs.writeFileSync(jsonPath, JSON.stringify(prospects, null, 2));

  console.log(`✅ Successfully converted ${prospects.length} prospects`);
  console.log('JSON file created at:', jsonPath);
} catch (error) {
  console.error('Error converting CSV:', error.message);
  process.exit(1);
}

