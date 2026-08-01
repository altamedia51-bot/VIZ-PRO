const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const scrollbarCss = `
@layer base {
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }
}
`;

if (!code.includes('::-webkit-scrollbar')) {
  code = code + scrollbarCss;
  fs.writeFileSync('src/index.css', code);
}
