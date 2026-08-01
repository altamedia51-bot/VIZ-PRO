const fs = require('fs');
let code = fs.readFileSync('src/components/Editor.tsx', 'utf8');

const targetStr = `{isSubtitle && (
    <div className="space-y-2 mt-4 flex flex-col max-h-[500px]">
      <div className="flex justify-between items-center mb-1">
        <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Editor Subtitle</label>
        <button onClick={() => {
          setProject(prev => ({
            ...prev,
            subtitles: [...(prev.subtitles || []), { id: crypto.randomUUID(), start: prev.subtitles?.length ? prev.subtitles[prev.subtitles.length - 1].end : 0, end: prev.subtitles?.length ? prev.subtitles[prev.subtitles.length - 1].end + 2 : 2, text: 'New Subtitle' }]
          }))
        }} className="text-[10px] text-blue-500 hover:text-blue-400 font-bold flex items-center gap-1">+ TAMBAH</button>
      </div>
      <div className="overflow-y-auto pr-2 space-y-2 pb-4">
      {project.subtitles?.map((sub, index) => (
        <div key={sub.id} className="bg-black/30 border border-white/5 rounded-lg p-2.5 flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-gray-500 w-8">Mulai</span>
            <input 
              type="number" 
              step="0.1" 
              value={sub.start} 
              onChange={e => {
                const newSubs = [...(project.subtitles || [])];
                newSubs[index] = { ...newSubs[index], start: Number(e.target.value) };
                setProject(prev => ({ ...prev, subtitles: newSubs }));
              }}
              className="flex-1 bg-[#1A1A1A] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500" 
              title="Start Time (s)"
            />
            <span className="text-[10px] text-gray-500 w-8 text-center">Akhir</span>
            <input 
              type="number" 
              step="0.1" 
              value={sub.end} 
              onChange={e => {
                const newSubs = [...(project.subtitles || [])];
                newSubs[index] = { ...newSubs[index], end: Number(e.target.value) };
                setProject(prev => ({ ...prev, subtitles: newSubs }));
              }}
              className="flex-1 bg-[#1A1A1A] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500" 
              title="End Time (s)"
            />
            <button 
              onClick={() => {
                const newSubs = (project.subtitles || []).filter((_, i) => i !== index);
                setProject(prev => ({ ...prev, subtitles: newSubs }));
              }}
              className="text-gray-500 hover:text-red-400 p-1 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <textarea
            value={sub.text}
            onChange={e => {
              const newSubs = [...(project.subtitles || [])];
              newSubs[index] = { ...newSubs[index], text: e.target.value };
              setProject(prev => ({ ...prev, subtitles: newSubs }));
            }}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 min-h-[50px] resize-y"
            placeholder="Teks subtitle..."
          />
        </div>
      ))}
      {(!project.subtitles || project.subtitles.length === 0) && (
        <div className="text-center py-8 text-gray-500 text-xs">
          Belum ada subtitle.<br/>Upload file SRT atau tambah manual.
        </div>
      )}
      </div>
    </div>
  )}`;

const replacementStr = `{isSubtitle && (
    <div className="space-y-2 mt-4 flex flex-col">
      <div className="flex justify-between items-center mb-1">
        <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Editor Subtitle</label>
        <button onClick={() => {
          setProject(prev => ({
            ...prev,
            subtitles: [...(prev.subtitles || []), { id: crypto.randomUUID(), start: prev.subtitles?.length ? Math.round(prev.subtitles[prev.subtitles.length - 1].end * 100)/100 : 0, end: prev.subtitles?.length ? Math.round((prev.subtitles[prev.subtitles.length - 1].end + 2) * 100)/100 : 2, text: 'New Subtitle' }]
          }))
        }} className="text-[10px] text-blue-500 hover:text-blue-400 font-bold flex items-center gap-1">+ TAMBAH</button>
      </div>
      <div className="space-y-2 pb-4">
      {project.subtitles?.map((sub, index) => (
        <div key={sub.id} className="bg-[#1A1A1A]/80 border border-white/5 rounded-lg p-3 flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Mulai (detik)</span>
              <input 
                type="number" 
                step="0.01" 
                value={Math.round(sub.start * 100) / 100} 
                onChange={e => {
                  const newSubs = [...(project.subtitles || [])];
                  newSubs[index] = { ...newSubs[index], start: Number(e.target.value) };
                  setProject(prev => ({ ...prev, subtitles: newSubs }));
                }}
                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Akhir (detik)</span>
              <input 
                type="number" 
                step="0.01" 
                value={Math.round(sub.end * 100) / 100} 
                onChange={e => {
                  const newSubs = [...(project.subtitles || [])];
                  newSubs[index] = { ...newSubs[index], end: Number(e.target.value) };
                  setProject(prev => ({ ...prev, subtitles: newSubs }));
                }}
                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
              />
            </div>
            <button 
              onClick={() => {
                const newSubs = (project.subtitles || []).filter((_, i) => i !== index);
                setProject(prev => ({ ...prev, subtitles: newSubs }));
              }}
              className="text-gray-500 hover:text-red-400 p-1.5 mt-4 transition-colors"
              title="Hapus Subtitle"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="mt-1">
            <textarea
              value={sub.text}
              onChange={e => {
                const newSubs = [...(project.subtitles || [])];
                newSubs[index] = { ...newSubs[index], text: e.target.value };
                setProject(prev => ({ ...prev, subtitles: newSubs }));
              }}
              className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 min-h-[60px] resize-y"
              placeholder="Teks subtitle..."
            />
          </div>
        </div>
      ))}
      {(!project.subtitles || project.subtitles.length === 0) && (
        <div className="text-center py-8 bg-black/20 rounded-lg border border-white/5 text-gray-500 text-xs">
          Belum ada subtitle.<br/>Upload file SRT atau tambah manual.
        </div>
      )}
      </div>
    </div>
  )}`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/Editor.tsx', code);
