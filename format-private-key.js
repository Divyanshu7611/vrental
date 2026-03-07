// Helper script to format Firebase private key
// Run with: node format-private-key.js

const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

// Find the private key line
let privateKeyLine = null;
let privateKeyLineIndex = -1;
let varName = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.includes('PRIVATE_KEY') && (line.includes('NEXT_FIREBASE') || line.includes('FIREBASE') || line.includes('NEXT_PUBLIC'))) {
    privateKeyLine = line;
    privateKeyLineIndex = i;
    // Extract variable name
    const nameMatch = line.match(/^([^=]+)=/);
    if (nameMatch) {
      varName = nameMatch[1].trim();
    }
    break;
  }
}

if (!privateKeyLine) {
  console.error('❌ Could not find PRIVATE_KEY in .env.local');
  process.exit(1);
}

console.log('Found private key line:', privateKeyLineIndex + 1);
console.log('Variable name:', varName);
console.log('Original line (first 150 chars):', privateKeyLine.substring(0, 150) + '...');

// Extract the key value - handle quoted and unquoted values
let keyValue = '';
if (privateKeyLine.includes('=')) {
  const equalIndex = privateKeyLine.indexOf('=');
  keyValue = privateKeyLine.substring(equalIndex + 1).trim();
} else {
  console.error('❌ Could not find = in private key line');
  process.exit(1);
}

// Remove quotes if present
if ((keyValue.startsWith('"') && keyValue.endsWith('"')) ||
    (keyValue.startsWith("'") && keyValue.endsWith("'"))) {
  keyValue = keyValue.slice(1, -1);
}

// Replace \n with actual newlines
keyValue = keyValue.replace(/\\n/g, '\n');

// Fix BEGIN/END markers
keyValue = keyValue
  .replace(/-{3,6}BEGIN\s+PRIVATE\s+KEY-{3,6}/gi, '-----BEGIN PRIVATE KEY-----')
  .replace(/-{3,6}END\s+PRIVATE\s+KEY-{3,6}/gi, '-----END PRIVATE KEY-----');

// Extract key content
const beginMatch = keyValue.match(/-----BEGIN\s+PRIVATE\s+KEY-----\s*/i);
const endMatch = keyValue.match(/\s*-----END\s+PRIVATE\s+KEY-----/i);

if (!beginMatch || !endMatch) {
  console.error('❌ Could not find BEGIN/END markers');
  console.error('Key preview:', keyValue.substring(0, 200));
  process.exit(1);
}

const beginIndex = beginMatch.index + beginMatch[0].length;
const endIndex = endMatch.index;

let keyContent = keyValue.substring(beginIndex, endIndex);

// Clean the key content - remove all whitespace
keyContent = keyContent.replace(/[\s\n\r\t]/g, '');

// Remove non-base64 characters
keyContent = keyContent.replace(/[^A-Za-z0-9+\/=]/g, '');

console.log('Extracted key content length:', keyContent.length);

if (keyContent.length < 100) {
  console.error('❌ Key content is too short:', keyContent.length);
  process.exit(1);
}

// Format into 64-character lines
const formattedLines = [];
for (let i = 0; i < keyContent.length; i += 64) {
  formattedLines.push(keyContent.substring(i, i + 64));
}

// Reconstruct the key
const formattedKey = `-----BEGIN PRIVATE KEY-----\n${formattedLines.join('\n')}\n-----END PRIVATE KEY-----\n`;

// Format for .env.local (escape newlines)
const envFormattedKey = formattedKey.replace(/\n/g, '\\n');

// Use the variable name we already extracted
if (!varName) {
  varName = privateKeyLine.split('=')[0].trim();
}

// Create the new line
const newLine = `${varName}="${envFormattedKey}"`;

console.log('\n✅ Formatted private key:');
console.log('Variable name:', varName);
console.log('Formatted key length:', formattedKey.length);
console.log('Number of lines:', formattedLines.length + 2);

// Update the line
lines[privateKeyLineIndex] = newLine;

// Write back to file
const newContent = lines.join('\n');
fs.writeFileSync(envPath, newContent, 'utf8');

console.log('\n✅ Updated .env.local file!');
console.log('Please restart your dev server.');

