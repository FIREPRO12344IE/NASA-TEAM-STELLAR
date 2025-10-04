// This script extracts the CSV from the zip file
// Run manually if needed: node scripts/extract-csv.js

const fs = require('fs');
const path = require('path');

// For now, we'll manually extract the CSV
// The user needs to unzip SB_publications-main.zip and place SB_publication_PMC.csv in public/data/

console.log('Please manually extract SB_publication_PMC.csv from the zip file to public/data/');
