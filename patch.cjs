const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

code = code.replace(
  '<div>\n                            <label className="block text-[10px] text-gray-400 mb-1">Isi Teks</label>\n                            <input type="text" value={el.text} onChange={e => updateElement(el.id, { text: e.target.value })} className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />\n                          </div>',
  `{!isSubtitle && (
    <div>
      <label className="block text-[10px] text-gray-400 mb-1">Isi Teks</label>
      <input type="text" value={el.text || ''} onChange={e => updateElement(el.id, { text: e.target.value })} className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />
    </div>
  )}
  {isSubtitle && (
    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
      <p className="text-xs text-indigo-300">Teks subtitle otomatis dari file SRT.</p>
    </div>
  )}`
);

fs.writeFileSync('src/components/Editor.tsx', code);
