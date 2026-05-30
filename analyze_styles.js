const fs = require('fs');
const html = fs.readFileSync('preview-2.html', 'utf8');

// Find all style="..." patterns in the HTML body (after </head>)
const bodyStart = html.indexOf('</head>');
const body = html.slice(bodyStart);

const styleRegex = /style="([^"]*)"/g;
const styleMap = new Map();
let match;

while ((match = styleRegex.exec(body)) !== null) {
  const value = match[1].trim();
  if (value) {
    styleMap.set(value, (styleMap.get(value) || 0) + 1);
  }
}

// Sort by frequency (desc)
const sorted = [...styleMap.entries()].sort((a, b) => b[1] - a[1]);

console.log('=== ALL UNIQUE INLINE STYLES ===');
console.log(`Total unique patterns: ${sorted.length}`);
console.log(`Total occurrences: ${sorted.reduce((s, [,c]) => s + c, 0)}\n`);

sorted.forEach(([value, count], i) => {
  // Generate a CSS class name from the style value
  // We'll map: fs-11, fw-700, c-accent, d-flex, gap-12, etc.
  const props = value.split(';').map(p => p.trim()).filter(Boolean);
  const className = `is-${i}`;
  console.log(`${className}  (x${count}):  ${value}`);
});
