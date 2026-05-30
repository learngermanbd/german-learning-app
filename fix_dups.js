const fs = require('fs');
let html = fs.readFileSync('preview-2.html', 'utf8');

// Fix duplicate class attributes: class="A B" class="is-N" -> class="A B is-N"
// Regex matches two consecutive class attributes
let count = 0;
let prevHtml;
do {
  prevHtml = html;
  // Match: class="..." class="..." within the same tag
  // We need to merge them
  html = html.replace(/(<[^>]*?class=")([^"]*)(")(\s+class=")([^"]*)(")/g, (match, p1, p2, p3, p4, p5, p6) => {
    count++;
    return `${p1}${p2} ${p5}${p6}`;
  });
} while (html !== prevHtml);

fs.writeFileSync('preview-2.html', html, 'utf8');
console.log(`✅ Fixed ${count} duplicate class attributes`);

// Verify no more duplicates
const remaining = html.match(/class="[^"]*"\s+class="/g);
if (remaining) {
  console.log(`⚠️  ${remaining.length} duplicate class attributes still remain`);
  remaining.forEach(d => console.log(`  ${d}`));
} else {
  console.log(`✅ No duplicate class attributes remaining`);
}
