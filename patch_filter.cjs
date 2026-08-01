const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

code = code.replace(
  "className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors whitespace-nowrap ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-[#1A1A1A] text-gray-400 border border-white/5 hover:bg-white/10'}`}",
  "className={`flex-shrink-0 px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors whitespace-nowrap ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-[#1A1A1A] text-gray-400 border border-white/5 hover:bg-white/10'}`}"
);

code = code.replace(
  '<div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">',
  '<div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>'
);

fs.writeFileSync('src/components/Editor.tsx', code);
