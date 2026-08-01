const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

const oldTemplates = `                          <button onClick={() => updateElement(el.id, { templateStyle: 'glow_border', color: '#ff00ff' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="font-bold text-xs" style={{WebkitTextStroke: '1px #ff00ff', color: 'transparent', textShadow: '0 0 5px #ff00ff'}}>BORDER</span>
                          </button>
                        </div>`;

const newTemplates = `                          <button onClick={() => updateElement(el.id, { templateStyle: 'glow_border', color: '#ff00ff' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="font-bold text-xs" style={{WebkitTextStroke: '1px #ff00ff', color: 'transparent', textShadow: '0 0 5px #ff00ff'}}>BORDER</span>
                          </button>
                          <button onClick={() => updateElement(el.id, { templateStyle: 'tiktok_pop', color: '#ffffff' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="text-white font-bold text-xs" style={{textShadow: '2px 2px 0px #000000'}}>POP-UP</span>
                          </button>
                          <button onClick={() => updateElement(el.id, { templateStyle: 'tiktok_karaoke', color: '#00ff00' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="text-white font-bold text-xs" style={{textShadow: '2px 2px 0px #000000'}}>KARAOKE</span>
                          </button>
                          <button onClick={() => updateElement(el.id, { templateStyle: 'tiktok_shadow', color: '#ffffff' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="text-white font-bold text-[10px]" style={{textShadow: '-2px 0px 0px #00ffff, 2px 0px 0px #ff0050'}}>TIKTOK</span>
                          </button>
                        </div>`;

code = code.replace(oldTemplates, newTemplates);
fs.writeFileSync('src/components/Editor.tsx', code);
