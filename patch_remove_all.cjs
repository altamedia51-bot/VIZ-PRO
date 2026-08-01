const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

code = code.replace(
  "type FilterType = 'all' | 'spectrum' | 'circular' | 'cyber' | 'particles' | 'waves' | 'glow' | 'elements';",
  "type FilterType = 'spectrum' | 'circular' | 'cyber' | 'particles' | 'waves' | 'glow' | 'elements';"
);

code = code.replace(
  "const [activeFilter, setActiveFilter] = useState<FilterType>('all');",
  "const [activeFilter, setActiveFilter] = useState<FilterType>('spectrum');"
);

code = code.replace(
  "(['all', 'spectrum', 'circular', 'cyber', 'particles', 'elements'] as FilterType[])",
  "(['spectrum', 'circular', 'cyber', 'particles', 'elements'] as FilterType[])"
);

fs.writeFileSync('src/components/Editor.tsx', code);
