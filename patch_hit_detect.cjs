const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasRenderer.tsx', 'utf8');

code = code.replace(
  "if (el.type === 'circle' || el.type === 'double_circle' || el.type === 'circular_spectrum' || el.type === 'bass_pulse') {",
  "if (el.type === 'circle' || el.type === 'double_circle' || el.type === 'circular_spectrum' || el.type === 'bass_pulse' || el.type === 'triangle_spectrum' || el.type === 'diamond_spectrum' || el.type === 'glowing_ring') {"
);

code = code.replace(
  "else if (el.type === 'bars' || el.type === 'symmetrical_mirror') {",
  "else if (el.type === 'bars' || el.type === 'symmetrical_mirror' || el.type === 'mirrored_bars') {"
);

fs.writeFileSync('src/components/CanvasRenderer.tsx', code);
