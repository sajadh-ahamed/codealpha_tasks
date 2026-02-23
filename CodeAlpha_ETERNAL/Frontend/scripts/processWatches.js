// Script to process watch images and extract data
const fs = require('fs');
const path = require('path');

// AED to USD conversion rate (1 AED = 0.27 USD approximately)
const AED_TO_USD = 0.27;

// Model names mapping for watches without clear model names
const modelNames = {
  'hublot': {
    'Big bang': 'Big Bang',
    'classic fusion': 'Classic Fusion',
    'Square bang': 'Square Bang'
  },
  'Omega': {
    'Constellation': 'Constellation',
    'Seamaster': 'Seamaster',
    'SpeedMaster': 'Speedmaster'
  },
  'Patek Philippe': {
    'Aquanaut': 'Aquanaut',
    'Calatrava': 'Calatrava',
    'Nautilus': 'Nautilus'
  },
  'RIchard Mille': {
    'Automatic': 'Automatic Collection',
    'Manual': 'Manual Collection',
    'rare models': 'Rare Models'
  },
  'Rolex': {
    'daytona': 'Daytona',
    'GMT-MASTER 11': 'GMT-Master II',
    'submariner': 'Submariner',
    'day date': 'Day-Date',
    'lady date just': 'Lady-Datejust'
  }
};

function extractPriceFromFilename(filename) {
  // Extract AED price from filename
  // Patterns: AED101,000, AED 101,000, AED101000, 1AED 122 945, etc.
  const patterns = [
    /AED\s*([\d,]+)/i,
    /([\d,]+)\s*AED/i,
    /aed\s*([\d,]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = filename.match(pattern);
    if (match) {
      const priceStr = match[1].replace(/,/g, '');
      return parseFloat(priceStr);
    }
  }
  
  return null;
}

function extractModelName(filename, brand, category) {
  // Try to extract model name from filename
  const cleanName = filename
    .replace(/\.(jpg|jpeg|png|webp)$/i, '')
    .replace(/AED[\d,\s]+/gi, '')
    .replace(/Current/gi, '')
    .trim();
  
  // Use brand-specific model mapping if available
  if (modelNames[brand] && modelNames[brand][category]) {
    return modelNames[brand][category];
  }
  
  // Extract from filename patterns
  const brandPatterns = {
    'Rolex': /Rolex[-\s]+([A-Za-z-]+)/i,
    'Hublot': /Hublot[-\s]+([A-Za-z-]+)/i,
    'Omega': /Omega[-\s]+([A-Za-z-]+)/i,
    'Patek Philippe': /Patek[-\s]+Philippe[-\s]+([A-Za-z-]+)/i
  };
  
  if (brandPatterns[brand]) {
    const match = cleanName.match(brandPatterns[brand]);
    if (match) {
      return match[1].replace(/-/g, ' ').trim();
    }
  }
  
  return category || 'Classic';
}

function processWatches() {
  const watches = [];
  const basePath = path.join(__dirname, '..', 'public', 'assets', 'images', 'watches');
  
  function processDirectory(dirPath, gender, brand = '', category = '') {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        // If it's a brand folder (men/women level)
        if (!brand && item.name !== 'men' && item.name !== 'women') {
          processDirectory(fullPath, gender, item.name, '');
        } else {
          // It's a category folder
          processDirectory(fullPath, gender, brand, item.name);
        }
      } else if (item.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(item.name)) {
        const priceAED = extractPriceFromFilename(item.name);
        if (priceAED) {
          const priceUSD = Math.round(priceAED * AED_TO_USD * 100) / 100;
          const modelName = extractModelName(item.name, brand, category);
          
          // Create relative path for image
          const relativePath = path.relative(
            path.join(__dirname, '..', 'public'),
            fullPath
          ).replace(/\\/g, '/');
          
          watches.push({
            name: `${brand} ${modelName}`,
            category: gender === 'men' ? 'Men' : 'Women',
            brand: brand,
            model: modelName,
            price: priceUSD,
            priceAED: priceAED,
            image: `/${relativePath}`,
            images: [`/${relativePath}`],
            description: `Exquisite ${brand} ${modelName} timepiece. Premium craftsmanship and luxury design.`,
            stock: Math.floor(Math.random() * 30) + 5,
            rating: (Math.random() * 1 + 4).toFixed(1),
            reviews: Math.floor(Math.random() * 200) + 20,
            featured: Math.random() > 0.7,
            dateAdded: new Date().toISOString().split('T')[0]
          });
        }
      }
    }
  }
  
  // Process men's watches
  const menPath = path.join(basePath, 'men');
  if (fs.existsSync(menPath)) {
    processDirectory(menPath, 'men');
  }
  
  // Process women's watches
  const womenPath = path.join(basePath, 'women');
  if (fs.existsSync(womenPath)) {
    processDirectory(womenPath, 'women');
  }
  
  return watches;
}

// Run the script
const watches = processWatches();
console.log(`Processed ${watches.length} watches`);

// Write to a JSON file
fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'utils', 'watchData.json'),
  JSON.stringify(watches, null, 2)
);

console.log('Watch data generated successfully!');
