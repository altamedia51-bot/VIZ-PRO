const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

code = code.replace(
  "selectedElementId && project.elements.find(e => e.id === selectedElementId)?.type === 'text' ?",
  "selectedElementId && (project.elements.find(e => e.id === selectedElementId)?.type === 'text' || project.elements.find(e => e.id === selectedElementId)?.type === 'subtitle') ?"
);

fs.writeFileSync('src/components/Editor.tsx', code);
