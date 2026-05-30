const fs = require('fs');
let html = fs.readFileSync('preview-2.html', 'utf8');

// Fix: table<tbody> class="..." -> <table class="..."><tbody>
// The regex inserted <tbody> after <table but before the rest of the tag
// Pattern: table<tbody> X -> <table X><tbody>
html = html.replace(/table<tbody>/g, '<table><tbody>');
html = html.replace(/<\/tbody><\/table>/g, '</tbody></table>');

// Also check for any remaining malformed patterns
html = html.replace(/table<tbody>/g, '<table><tbody>');

fs.writeFileSync('preview-2.html', html, 'utf8');
console.log('✅ Fixed malformed <tbody> tags');
