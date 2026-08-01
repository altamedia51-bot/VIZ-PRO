const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasRenderer.tsx', 'utf8');

const target = `
              if (!textToRender) {
                 if (draggingId === el.id || selectedElementId === el.id) {
                   textToRender = 'Subtitle Placeholder';
                 } else {
                   continue;
                 }
              }
`;

const replacement = `
              if (!textToRender) {
                 if (draggingId === el.id || selectedElementId === el.id) {
                   textToRender = 'Subtitle Placeholder';
                 } else {
                   continue;
                 }
              }

              if (el.textCase) {
                if (el.textCase === 'uppercase') {
                  textToRender = textToRender.toUpperCase();
                } else if (el.textCase === 'lowercase') {
                  textToRender = textToRender.toLowerCase();
                } else if (el.textCase === 'capitalize') {
                  textToRender = textToRender.replace(/\\b\\w/g, c => c.toUpperCase());
                }
              }
`;

code = code.replace(target, replacement);

const targetText = `            if (el.type === 'text') {
              textToRender = el.text;`;

const replacementText = `            if (el.type === 'text') {
              textToRender = el.text;
              if (el.textCase) {
                if (el.textCase === 'uppercase') {
                  textToRender = textToRender.toUpperCase();
                } else if (el.textCase === 'lowercase') {
                  textToRender = textToRender.toLowerCase();
                } else if (el.textCase === 'capitalize') {
                  textToRender = textToRender.replace(/\\b\\w/g, c => c.toUpperCase());
                }
              }`;

code = code.replace(targetText, replacementText);

fs.writeFileSync('src/components/CanvasRenderer.tsx', code);
