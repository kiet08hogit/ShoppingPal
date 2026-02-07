import * as fs from 'fs';
import * as path from 'path';
import pool from '../src/db/pool';

const categoryFolders = {
  'industrial_hard_hat': {
    sourceFolder: path.join(__dirname, '../../image/img_HardHat'),
    publicPath: '/images/products/hard_hat'
  },
  'industrial_safety_gloves': {
    sourceFolder: path.join(__dirname, '../../image/img_gloves'),
    publicPath: '/images/products/safety_gloves'
  },
  'industrial_power_tools': {
    sourceFolder: path.join(__dirname, '../../image/img_PowerTool'),
    publicPath: '/images/products/power_tools'
  },
  'industrial_safety_glasses': {
    sourceFolder: path.join(__dirname, '../../image/img_Glasses'),
    publicPath: '/images/products/safety_glasses'
  }
};

async function copyImages() {
  const publicImagesDir = path.join(__dirname, '../../frontend/public/images/products');
  
  // Create subdirectories for each category
  for (const [tableName, config] of Object.entries(categoryFolders)) {
    const categoryName = config.publicPath.split('/').pop()!;
    const targetDir = path.join(publicImagesDir, categoryName);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    console.log(`\nProcessing ${tableName}...`);
    
    // Read all files from source folder
    const files = fs.readdirSync(config.sourceFolder);
    
    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
        const sourcePath = path.join(config.sourceFolder, file);
        const targetPath = path.join(targetDir, file);
        
        // Copy file
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied: ${file}`);
      }
    }
  }
}

async function updateDatabaseImages() {
  console.log('\n\nUpdating database with image URLs...\n');
  
  for (const [tableName, config] of Object.entries(categoryFolders)) {
    const categoryName = config.publicPath.split('/').pop()!;
    const sourceFolder = config.sourceFolder;
    
    // Read all files from source folder
    const files = fs.readdirSync(sourceFolder)
      .filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'))
      .sort();
    
    console.log(`\nUpdating ${tableName}...`);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const productId = i + 1; // IDs start at 1
      const imageUrl = `${config.publicPath}/${file}`;
      
      try {
        const query = `UPDATE ${tableName} SET image_url = $1 WHERE id = $2`;
        await pool.query(query, [imageUrl, productId]);
        console.log(`Updated product ${productId}: ${imageUrl}`);
      } catch (error) {
        console.error(`Error updating product ${productId} in ${tableName}:`, error);
      }
    }
  }
}

async function main() {
  try {
    console.log('Starting image migration...\n');
    
    // Step 1: Copy images
    console.log('=== Step 1: Copying Images ===');
    await copyImages();
    
    // Step 2: Update database
    console.log('\n=== Step 2: Updating Database ===');
    await updateDatabaseImages();
    
    console.log('\n\n✅ Image migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

main();
