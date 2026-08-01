const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasRenderer.tsx', 'utf8');

const target = `            } else if (el.type === 'subtitle') {
              const currentT = currentTimeRef.current;
              const activeSub = project?.subtitles?.find(s => currentT >= s.start && currentT <= s.end);
              textToRender = activeSub ? activeSub.text : '';
                 
              if (el.shadowBlur) {
                ctx.shadowBlur = el.shadowBlur;
                ctx.shadowColor = el.shadowColor || '#000000';
              }
            }

            if (!textToRender && el.type === 'subtitle') {
               // Render a placeholder if currently dragging or if it's the selected element (so user can see where it is)
               if (draggingId === el.id || selectedElementId === el.id) {
                 textToRender = 'Subtitle Placeholder';
               } else {
                 continue;
               }
            }

            ctx.font = \`\${el.fontSize}px \${el.fontFamily}\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
               
            if (el.letterSpacing) {
               ctx.letterSpacing = \`\${el.letterSpacing}px\`;
            }

            const width = ctx.measureText(textToRender).width;
            ctx.fillStyle = getStyle(el, el.x - width/2, finalY, el.x + width/2, finalY);
               
            ctx.globalAlpha = el.opacity * alpha;
               
            if (finalScale !== 1) {
               ctx.save();
               ctx.translate(el.x, finalY);
               ctx.scale(finalScale, finalScale);
                  
               // Multi-line support for subtitles
               const lines = textToRender.split('\\n');
               const lineHeight = el.fontSize * 1.2;
               const startY = -(lines.length - 1) * lineHeight / 2;
               lines.forEach((line, i) => {
                 ctx.fillText(line, 0, startY + i * lineHeight);
               });
                  
               ctx.restore();
            } else {
               const lines = textToRender.split('\\n');
               const lineHeight = el.fontSize * 1.2;
               const startY = finalY - (lines.length - 1) * lineHeight / 2;
               lines.forEach((line, i) => {
                 ctx.fillText(line, el.x, startY + i * lineHeight);
               });
            }
               
            ctx.shadowBlur = 0;
            ctx.letterSpacing = '0px';
          }`;

const replacement = `            } else if (el.type === 'subtitle') {
              const currentT = currentTimeRef.current;
              const activeSub = project?.subtitles?.find(s => currentT >= s.start && currentT <= s.end);
              textToRender = activeSub ? activeSub.text : '';
                 
              if (el.shadowBlur) {
                ctx.shadowBlur = el.shadowBlur;
                ctx.shadowColor = el.shadowColor || '#000000';
              }
              
              if (!textToRender) {
                 if (draggingId === el.id || selectedElementId === el.id) {
                   textToRender = 'Subtitle Placeholder';
                 } else {
                   continue;
                 }
              }

              ctx.font = \`\${el.fontSize}px \${el.fontFamily}\`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
                 
              if (el.letterSpacing) {
                 ctx.letterSpacing = \`\${el.letterSpacing}px\`;
              }

              const width = ctx.measureText(textToRender).width;
              ctx.globalAlpha = el.opacity * alpha;
              
              let progress = 0;
              if (activeSub) {
                progress = Math.max(0, Math.min(1, (currentT - activeSub.start) / (activeSub.end - activeSub.start)));
              }

              ctx.save();
              ctx.translate(el.x, finalY);
              
              // Apply TikTok Pop-up animation
              if (el.templateStyle === 'tiktok_pop') {
                // scale from 0.5 to 1.0 very quickly at the beginning
                const popScale = progress < 0.1 ? 0.5 + (progress / 0.1) * 0.5 : 1.0;
                ctx.scale(popScale, popScale);
                // slight rotation wobble
                const rotation = Math.sin(progress * Math.PI * 4) * 0.05 * (1 - progress);
                ctx.rotate(rotation);
              } else if (finalScale !== 1) {
                ctx.scale(finalScale, finalScale);
              }

              const lines = textToRender.split('\\n');
              const lineHeight = el.fontSize * 1.2;
              const startY = -(lines.length - 1) * lineHeight / 2;
              const paddingX = 20;
              const paddingY = 10;
              
              // Pre-render Backgrounds
              if (el.templateStyle === 'bubble_yellow' || el.templateStyle === 'bubble_black') {
                 lines.forEach((line, i) => {
                   const lineWidth = ctx.measureText(line).width;
                   ctx.fillStyle = el.templateStyle === 'bubble_yellow' ? '#FFD700' : 'rgba(0, 0, 0, 0.7)';
                   ctx.beginPath();
                   ctx.roundRect(-lineWidth/2 - paddingX, startY + i * lineHeight - el.fontSize/2 - paddingY, lineWidth + paddingX*2, el.fontSize + paddingY*2, el.templateStyle === 'bubble_yellow' ? 12 : 8);
                   ctx.fill();
                   
                   if (el.templateStyle === 'bubble_black') {
                     ctx.strokeStyle = el.color || '#FFFFFF';
                     ctx.lineWidth = 2;
                     ctx.stroke();
                   }
                 });
              }

              // Render text line by line
              lines.forEach((line, i) => {
                const lineY = startY + i * lineHeight;
                
                if (el.templateStyle === 'bubble_yellow') {
                  ctx.fillStyle = '#000000';
                  ctx.fillText(line, 0, lineY);
                } else if (el.templateStyle === 'bubble_black') {
                  ctx.fillStyle = el.color || '#FFFFFF';
                  ctx.fillText(line, 0, lineY);
                } else if (el.templateStyle === 'neon') {
                  ctx.shadowBlur = 15;
                  ctx.shadowColor = el.color || '#00FFFF';
                  ctx.fillStyle = '#FFFFFF';
                  ctx.fillText(line, 0, lineY);
                  ctx.fillText(line, 0, lineY); // double fill for stronger neon
                } else if (el.templateStyle === 'glow_border') {
                  ctx.strokeStyle = el.color || '#FF00FF';
                  ctx.lineWidth = 2;
                  ctx.shadowBlur = 10;
                  ctx.shadowColor = el.color || '#FF00FF';
                  ctx.strokeText(line, 0, lineY);
                  ctx.shadowBlur = 0;
                  ctx.fillStyle = '#FFFFFF';
                  ctx.fillText(line, 0, lineY);
                } else if (el.templateStyle === 'tiktok_pop' || el.templateStyle === 'tiktok_shadow') {
                  // TikTok text shadow
                  ctx.fillStyle = el.color || '#FFFFFF';
                  ctx.shadowColor = '#000000';
                  ctx.shadowBlur = 0;
                  ctx.shadowOffsetX = 2;
                  ctx.shadowOffsetY = 2;
                  
                  if (el.templateStyle === 'tiktok_shadow') {
                    // Cyan and Red offset
                    ctx.shadowColor = 'transparent';
                    ctx.fillStyle = '#00FFFF';
                    ctx.fillText(line, -2, lineY);
                    ctx.fillStyle = '#FF0050';
                    ctx.fillText(line, 2, lineY);
                    ctx.fillStyle = el.color || '#FFFFFF';
                  }
                  
                  ctx.fillText(line, 0, lineY);
                  ctx.shadowOffsetX = 0;
                  ctx.shadowOffsetY = 0;
                } else if (el.templateStyle === 'tiktok_karaoke') {
                  // Word by word highlighting
                  const words = line.split(' ');
                  const totalWords = words.length;
                  // For multi-line we simplify by distributing progress across all lines, 
                  // but here we just do it per line for simplicity or assume single line subtitle.
                  const activeWordIndex = Math.min(totalWords - 1, Math.floor(progress * totalWords));
                  
                  let currentX = 0;
                  // measure total width to center
                  const totalWidth = ctx.measureText(line).width;
                  let startX = -totalWidth / 2;
                  
                  ctx.textAlign = 'left';
                  words.forEach((word, wIdx) => {
                    const wordWidth = ctx.measureText(word).width;
                    const spaceWidth = ctx.measureText(' ').width;
                    
                    ctx.shadowColor = '#000000';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;
                    
                    if (wIdx === activeWordIndex) {
                      ctx.fillStyle = el.color || '#00FF00'; // Highlight color
                      // pop the word
                      ctx.save();
                      ctx.translate(startX + wordWidth/2, lineY);
                      ctx.scale(1.1, 1.1);
                      ctx.fillText(word, -wordWidth/2, 0);
                      ctx.restore();
                    } else if (wIdx < activeWordIndex) {
                      ctx.fillStyle = el.color || '#00FF00'; // Already sung
                      ctx.fillText(word, startX, lineY);
                    } else {
                      ctx.fillStyle = '#FFFFFF'; // Upcoming
                      ctx.fillText(word, startX, lineY);
                    }
                    startX += wordWidth + spaceWidth;
                  });
                  ctx.textAlign = 'center'; // restore
                } else {
                  // Default
                  ctx.fillStyle = getStyle(el, -width/2, lineY, width/2, lineY);
                  ctx.fillText(line, 0, lineY);
                }
              });

              ctx.restore();
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
              ctx.letterSpacing = '0px';
            }
          }`;

// Make sure target text doesn't contain subtle spacing differences by replacing all spaces
const cleanString = (str) => str.replace(/\s+/g, ' ');
if (cleanString(code).includes(cleanString(target))) {
  console.log("Replacing code using regex due to spacing differences...");
  // Escape regex
  const regexStr = target.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&').replace(/\s+/g, '\\s+');
  code = code.replace(new RegExp(regexStr), replacement);
  fs.writeFileSync('src/components/CanvasRenderer.tsx', code);
  console.log("Done");
} else {
  console.error("Target not found!");
}

