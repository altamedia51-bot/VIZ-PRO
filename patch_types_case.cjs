const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  "  templateStyle?: 'default' | 'bubble_yellow' | 'bubble_black' | 'neon' | 'glow_border' | 'tiktok_pop' | 'tiktok_karaoke' | 'tiktok_shadow';\n}",
  "  templateStyle?: 'default' | 'bubble_yellow' | 'bubble_black' | 'neon' | 'glow_border' | 'tiktok_pop' | 'tiktok_karaoke' | 'tiktok_shadow';\n  textCase?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';\n}"
);

code = code.replace(
  "  animation?: 'none' | 'glow_pulse' | 'wave' | 'bounce';\n}",
  "  animation?: 'none' | 'glow_pulse' | 'wave' | 'bounce';\n  textCase?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';\n}"
);

fs.writeFileSync('src/types.ts', code);
