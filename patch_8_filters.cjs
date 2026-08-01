const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

// Update FilterType
code = code.replace(
  "type FilterType = 'spectrum' | 'circular' | 'cyber' | 'particles' | 'waves' | 'glow' | 'elements';",
  "type FilterType = 'spectrum' | 'circular' | 'waves' | 'glow' | 'cyber' | 'particles' | 'shapes' | 'elements';"
);

// Update map
code = code.replace(
  "(['spectrum', 'circular', 'cyber', 'particles', 'elements'] as FilterType[])",
  "(['spectrum', 'circular', 'waves', 'glow', 'cyber', 'particles', 'shapes', 'elements'] as FilterType[])"
);

// Update container
code = code.replace(
  '<div className="flex flex-wrap gap-2 mb-4">',
  '<div className="grid grid-cols-4 gap-2 mb-4">'
);

// Fix button styling so they look good in a grid
code = code.replace(
  "className={`flex-shrink-0 px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors whitespace-nowrap ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-[#1A1A1A] text-gray-400 border border-white/5 hover:bg-white/10'}`}",
  "className={`w-full py-2 px-1 text-[9px] sm:text-[10px] font-bold uppercase rounded transition-colors flex items-center justify-center text-center leading-tight ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-[#1A1A1A] text-gray-400 border border-white/5 hover:bg-white/10'}`}"
);

// Fix categories of presets
code = code.replace(
  "{ type: 'triangle_spectrum', name: 'Triangle Spectrum', category: 'circular', label: 'SHAPE' }",
  "{ type: 'triangle_spectrum', name: 'Triangle Spectrum', category: 'shapes', label: 'SHAPE' }"
);
code = code.replace(
  "{ type: 'diamond_spectrum', name: 'Diamond Spectrum', category: 'circular', label: 'SHAPE' }",
  "{ type: 'diamond_spectrum', name: 'Diamond Spectrum', category: 'shapes', label: 'SHAPE' }"
);
code = code.replace(
  "{ type: 'glowing_ring', name: 'Glowing Ring', category: 'circular', label: 'GLOW' }",
  "{ type: 'glowing_ring', name: 'Glowing Ring', category: 'glow', label: 'GLOW' }"
);

fs.writeFileSync('src/components/Editor.tsx', code);
