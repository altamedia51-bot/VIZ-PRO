const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

const target = `                  {el.type === 'text' && (
                    <>
                      <label className="block">
                        <span className="text-[10px] text-gray-500 mb-1 block">Teks</span>
                        <input type="text" value={el.text} onChange={e => updateElement(el.id, { text: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                      </label>
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-500">Ukuran Font ({el.fontSize}px)</span>
                        </div>
                        <input type="range" min="10" max="200" value={el.fontSize} onChange={e => updateElement(el.id, { fontSize: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                      </label>
                    </>
                  )}`;

const replacement = `                  {(el.type === 'text' || el.type === 'subtitle') && (
                    <>
                      {el.type === 'text' && (
                        <label className="block">
                          <span className="text-[10px] text-gray-500 mb-1 block">Teks</span>
                          <input type="text" value={el.text} onChange={e => updateElement(el.id, { text: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                        </label>
                      )}
                      
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-500">Ukuran Font ({el.fontSize}px)</span>
                        </div>
                        <input type="range" min="10" max="200" value={el.fontSize} onChange={e => updateElement(el.id, { fontSize: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                      </label>
                      
                      <label className="block">
                        <span className="text-[10px] text-gray-500 mb-1 block">Format Teks (Case)</span>
                        <select 
                          value={el.textCase || 'none'} 
                          onChange={e => updateElement(el.id, { textCase: e.target.value as any })}
                          className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        >
                          <option value="none">Asli (Normal)</option>
                          <option value="uppercase">HURUF BESAR (UPPERCASE)</option>
                          <option value="lowercase">huruf kecil (lowercase)</option>
                          <option value="capitalize">Huruf Pertama Besar (Capitalize)</option>
                        </select>
                      </label>
                    </>
                  )}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/Editor.tsx', code);
