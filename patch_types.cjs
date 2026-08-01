const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  "templateStyle?: 'default' | 'bubble_yellow' | 'bubble_black' | 'neon' | 'glow_border';",
  "templateStyle?: 'default' | 'bubble_yellow' | 'bubble_black' | 'neon' | 'glow_border' | 'tiktok_pop' | 'tiktok_karaoke' | 'tiktok_shadow';"
);
fs.writeFileSync('src/types.ts', code);
