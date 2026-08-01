const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

code = code.replace(
  "const [activeFilter, setActiveFilter] = useState<FilterType>('spectrum');",
  "const [activeFilter, setActiveFilter] = useState<FilterType>('spectrum');\n  const [subtitleTab, setSubtitleTab] = useState<'basic' | 'templates'>('templates');"
);

const subtitleUI = `
                {el.type === 'subtitle' && (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2 p-1 bg-black/40 rounded-lg">
                      <button 
                        onClick={() => setSubtitleTab('basic')}
                        className={\`flex-1 py-1.5 text-[10px] font-bold uppercase rounded \${subtitleTab === 'basic' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}\`}
                      >
                        Basic
                      </button>
                      <button 
                        onClick={() => setSubtitleTab('templates')}
                        className={\`flex-1 py-1.5 text-[10px] font-bold uppercase rounded \${subtitleTab === 'templates' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}\`}
                      >
                        Templates
                      </button>
                    </div>

                    {subtitleTab === 'templates' && (
                      <div className="space-y-3">
                        <h3 className="text-[10px] text-gray-500 uppercase font-bold">Text Templates</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => updateElement(el.id, { templateStyle: 'default', color: '#ffffff' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="text-white font-bold">DEFAULT</span>
                          </button>
                          <button onClick={() => updateElement(el.id, { templateStyle: 'bubble_yellow', color: '#000000' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="bg-[#FFD700] text-black px-2 py-1 rounded font-bold text-xs">BUBBLE</span>
                          </button>
                          <button onClick={() => updateElement(el.id, { templateStyle: 'bubble_black', color: '#ffffff' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="bg-black text-white border border-white px-2 py-1 rounded font-bold text-xs">BLACK</span>
                          </button>
                          <button onClick={() => updateElement(el.id, { templateStyle: 'neon', color: '#00ffff' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="text-white font-bold text-xs" style={{textShadow: '0 0 10px #00ffff'}}>NEON</span>
                          </button>
                          <button onClick={() => updateElement(el.id, { templateStyle: 'glow_border', color: '#ff00ff' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="font-bold text-xs" style={{WebkitTextStroke: '1px #ff00ff', color: 'transparent', textShadow: '0 0 5px #ff00ff'}}>BORDER</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
`;

code = code.replace(
  "{/* Specific Properties */}",
  `${subtitleUI}\n                {/* Specific Properties */}`
);

fs.writeFileSync('src/components/Editor.tsx', code);
