#!/usr/bin/env node

/**
 * SEO Setup Script for Intermountain Dumpsters
 * This script helps you set up the required environment variables for SEO optimization
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 SEO Setup for Intermountain Dumpsters');
console.log('==========================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local file found');
} else {
  console.log('❌ .env.local file not found - will create one');
}

console.log('\n📋 Required Environment Variables:\n');

const requiredVars = [
  {
    name: 'NEXT_PUBLIC_GA_ID',
    description: 'Google Analytics 4 Measurement ID (starts with G-)',
    example: 'G-XXXXXXXXXX',
    url: 'https://analytics.google.com/'
  },
  {
    name: 'NEXT_PUBLIC_GTM_ID',
    description: 'Google Tag Manager Container ID (starts with GTM-)',
    example: 'GTM-XXXXXXX',
    url: 'https://tagmanager.google.com/'
  },
  {
    name: 'GOOGLE_SITE_VERIFICATION',
    description: 'Google Search Console verification code',
    example: 'your_verification_code_here',
    url: 'https://search.google.com/search-console'
  }
];

requiredVars.forEach((variable, index) => {
  console.log(`${index + 1}. ${variable.name}`);
  console.log(`   Description: ${variable.description}`);
  console.log(`   Example: ${variable.example}`);
  console.log(`   Get it from: ${variable.url}\n`);
});

console.log('🔗 Quick Setup Links:');
console.log('• Google Analytics: https://analytics.google.com/');
console.log('• Google Tag Manager: https://tagmanager.google.com/');
console.log('• Google Search Console: https://search.google.com/search-console');
console.log('• Google My Business: https://business.google.com/\n');

// Function to get user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Function to create or update .env.local
async function setupEnvFile() {
  console.log('📝 Setting up environment variables...\n');
  
  let envContent = '';
  
  if (envExists) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Add existing variables that aren't SEO-related
  const existingVars = [
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];
  
  existingVars.forEach(varName => {
    const regex = new RegExp(`^${varName}=.*$`, 'm');
    const match = envContent.match(regex);
    if (match) {
      console.log(`✅ Found existing ${varName}`);
    }
  });
  
  console.log('\n🔧 SEO Variables Setup:\n');
  
  const newVars = {};
  
  for (const variable of requiredVars) {
    const currentValue = envContent.match(new RegExp(`^${variable.name}=(.*)$`, 'm'));
    
    if (currentValue && currentValue[1] && currentValue[1] !== variable.example) {
      console.log(`✅ ${variable.name} already set to: ${currentValue[1]}`);
      newVars[variable.name] = currentValue[1];
    } else {
      const answer = await askQuestion(`Enter your ${variable.name} (or press Enter to skip): `);
      if (answer) {
        newVars[variable.name] = answer;
        console.log(`✅ ${variable.name} set to: ${answer}`);
      } else {
        console.log(`⏭️  Skipped ${variable.name}`);
      }
    }
  }
  
  // Update or create .env.local
  let updatedContent = envContent;
  
  Object.entries(newVars).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (updatedContent.match(regex)) {
      updatedContent = updatedContent.replace(regex, `${key}=${value}`);
    } else {
      updatedContent += `\n${key}=${value}`;
    }
  });
  
  // Add SEO comment if not present
  if (!updatedContent.includes('# SEO Variables')) {
    updatedContent = `# SEO Variables\n${updatedContent}`;
  }
  
  fs.writeFileSync(envPath, updatedContent);
  console.log('\n✅ .env.local file updated successfully!');
}

// Function to verify setup
async function verifySetup() {
  console.log('\n🔍 Verifying Setup...\n');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  let allGood = true;
  
  requiredVars.forEach(variable => {
    const match = envContent.match(new RegExp(`^${variable.name}=(.*)$`, 'm'));
    if (match && match[1] && match[1] !== variable.example) {
      console.log(`✅ ${variable.name} is configured`);
    } else {
      console.log(`❌ ${variable.name} is missing or not configured`);
      allGood = false;
    }
  });
  
  if (allGood) {
    console.log('\n🎉 All SEO variables are configured!');
    console.log('\n📋 Next Steps:');
    console.log('1. Restart your development server');
    console.log('2. Check Google Search Console for verification');
    console.log('3. Submit your sitemap: https://intermountaindumpsters.com/sitemap.xml');
    console.log('4. Set up Google My Business (see GOOGLE_MY_BUSINESS_SETUP.md)');
    console.log('5. Monitor your rankings in Google Search Console');
  } else {
    console.log('\n⚠️  Some variables are missing. Please configure them and run this script again.');
  }
}

// Main execution
async function main() {
  try {
    await setupEnvFile();
    await verifySetup();
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { setupEnvFile, verifySetup }; 