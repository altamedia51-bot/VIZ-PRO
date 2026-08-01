const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasRenderer.tsx', 'utf8');

const replacement = `
            ctx.globalAlpha = el.opacity * alpha;
            
            if (finalScale !== 1) {
               ctx.save();
               ctx.translate(el.x, finalY);
               ctx.scale(finalScale, finalScale);
               ctx.translate(-el.x, -finalY);
            }

            // Render Subtitle Background/Styles
            if (el.type === 'subtitle' && textToRender) {
              const metrics = ctx.measureText(textToRender);
              const textWidth = metrics.width;
              const textHeight = el.fontSize;
              const paddingX = 20;
              const paddingY = 10;
              
              if (el.templateStyle === 'bubble_yellow') {
                ctx.fillStyle = '#FFD700'; // Yellow
                ctx.beginPath();
                ctx.roundRect(el.x - textWidth/2 - paddingX, finalY - textHeight/2 - paddingY, textWidth + paddingX*2, textHeight + paddingY*2, 12);
                ctx.fill();
                ctx.fillStyle = '#000000'; // Black text
              } else if (el.templateStyle === 'bubble_black') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.beginPath();
                ctx.roundRect(el.x - textWidth/2 - paddingX, finalY - textHeight/2 - paddingY, textWidth + paddingX*2, textHeight + paddingY*2, 8);
                ctx.fill();
                ctx.fillStyle = el.color || '#FFFFFF'; // White text
                // Also add white border
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.stroke();
              } else if (el.templateStyle === 'neon') {
                ctx.shadowBlur = 15;
                ctx.shadowColor = el.color || '#00FFFF';
                ctx.fillStyle = '#FFFFFF'; // White center text
              } else if (el.templateStyle === 'glow_border') {
                ctx.strokeStyle = el.color || '#FF00FF';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 10;
                ctx.shadowColor = el.color || '#FF00FF';
                ctx.strokeText(textToRender, el.x, finalY);
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#FFFFFF';
              }
            }

            ctx.fillText(textToRender, el.x, finalY);

            if (finalScale !== 1) {
`;

code = code.replace(
  `            ctx.globalAlpha = el.opacity * alpha;
            
            if (finalScale !== 1) {
               ctx.save();
               ctx.translate(el.x, finalY);
               ctx.scale(finalScale, finalScale);
               ctx.translate(-el.x, -finalY);
            }
            
            ctx.fillText(textToRender, el.x, finalY);

            if (finalScale !== 1) {`,
  replacement
);

fs.writeFileSync('src/components/CanvasRenderer.tsx', code);
