const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

code = code.replace(
  '<div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>',
  '<div className="flex flex-wrap gap-2 mb-4">'
);

code = code.replace(
  '<div className="grid grid-cols-2 gap-3 overflow-y-scroll pb-4 pr-2">',
  '<div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4 pr-1 no-scrollbar">'
);

fs.writeFileSync('src/components/Editor.tsx', code);

let cssCode = fs.readFileSync('src/index.css', 'utf8');
cssCode = cssCode.replace(/@layer base \{[\s\S]*?::-webkit-scrollbar[\s\S]*?width: 6px;[\s\S]*?\}/g, '');
fs.writeFileSync('src/index.css', cssCode);
