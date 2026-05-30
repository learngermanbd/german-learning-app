const fs = require('fs');
let html = fs.readFileSync('preview-2.html', 'utf8');

// ===== STEP 1: Extract all unique inline styles from body content =====
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

const sorted = [...styleMap.entries()].sort((a, b) => b[1] - a[1]);

// ===== STEP 2: Build CSS class definitions =====
let cssBlock = '\n/* Auto-generated utility classes from inline styles */\n';
const styleToClass = new Map();

sorted.forEach(([value, count], i) => {
  const className = `is-${i}`;
  styleToClass.set(value, className);
  cssBlock += `.${className}{${value}}\n`;
});

// ===== STEP 3: Replace style attributes in body HTML =====
// Process from longest value first to avoid partial matches
const sortedByLength = [...styleToClass.entries()].sort((a, b) => b[0].length - a[0].length);

let bodyOnly = html.slice(bodyStart);

sortedByLength.forEach(([value, className]) => {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Case 1: Element has BOTH class="..." and style="..."
  // Pattern: class="existing" style="value" -> class="existing is-N"
  const withClassRegex = new RegExp(`(class="[^"]*") style="${escaped}"`, 'g');
  bodyOnly = bodyOnly.replace(withClassRegex, `$1 ${className}`);

  // Case 2: Element has style="..." but NO class attribute
  // Pattern: style="value" -> class="is-N"
  // But only if NOT preceded by class="
  const styleOnlyRegex = new RegExp(`style="${escaped}"`, 'g');
  bodyOnly = bodyOnly.replace(styleOnlyRegex, `class="${className}"`);
});

// Reassemble
html = html.slice(0, bodyStart) + bodyOnly;

// ===== STEP 4: Inject CSS classes before </style> =====
const styleEnd = html.lastIndexOf('</style>');
html = html.slice(0, styleEnd) + cssBlock + html.slice(styleEnd);

// ===== STEP 5: Fix buttons without type attribute =====
// Match <button not followed by type=, not already having type
const buttonRegex = /<button\s+(?!.*?type=)/g;
html = html.replace(buttonRegex, '<button type="button" ');

// Also catch <button> with no attributes at all
html = html.replace(/<button>/g, '<button type="button">');

// ===== STEP 6: Fix bare & characters (not HTML entities) =====
// Replace & that aren't part of &amp; &lt; &gt; &quot; &nbsp; &copy; etc.
html = html.replace(/&(?!(?:amp|lt|gt|quot|nbsp|copy|reg|mdash|ndash|#\d+|[a-zA-Z]+);)/g, '&amp;');

// ===== STEP 7: Fix tables without tbody =====
// Add <tbody> after <table> and </tbody> before </table> if no tbody exists
html = html.replace(/<table(?![\s>][^>]*>[\s\S]*?<tbody)/g, (match) => {
  return match + '<tbody>';
});
html = html.replace(/<\/table>/g, '</tbody></table>');

// ===== STEP 8: Write output =====
fs.writeFileSync('preview-2.html', html, 'utf8');

console.log(`✅ Converted ${styleToClass.size} unique inline styles to CSS classes`);
console.log(`✅ Fixed all buttons with type="button"`);
console.log(`✅ Fixed bare & characters to &amp;`);
console.log(`✅ Added <tbody> to tables`);
console.log(`✅ Total inline styles replaced: ${sorted.reduce((s, [,c]) => s + c, 0)}`);

// Verify
const finalBody = html.slice(html.indexOf('</head>'));
const remaining = finalBody.match(/style="/g);
if (remaining) {
  console.log(`⚠️  ${remaining.length} inline 'style=' still remaining`);
} else {
  console.log(`✅ Zero inline styles remaining!`);
}

// Check for duplicate class attributes
const dupClass = html.match(/class="[^"]*"\s+class="/g);
if (dupClass) {
  console.log(`⚠️  ${dupClass.length} duplicate class attributes found`);
  dupClass.forEach(d => console.log(`  ${d.trim()}`));
} else {
  console.log(`✅ No duplicate class attributes`);
}
