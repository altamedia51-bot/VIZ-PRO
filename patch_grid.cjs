const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

code = code.replace(
  '<div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4 pr-1">',
  '<div className="grid grid-cols-2 gap-3 overflow-y-scroll pb-4 pr-2">'
);

fs.writeFileSync('src/components/Editor.tsx', code);
