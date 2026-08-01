import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Project, VizElement, BackgroundType, TextElement } from '../types';
import { CanvasRenderer, CanvasRendererRef } from './CanvasRenderer';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { useAudioAnalyzer } from '../hooks/useAudioAnalyzer';
import { Recorder } from '../utils/recordStream';
import { Play, Pause, SkipBack, Square, Plus, Image as ImageIcon, Settings, Download, Trash2, Home, Music, Radio, Type, Sparkles, Layers, Search, Volume2, VolumeX } from 'lucide-react';
import { parseSRT } from '../utils/srtParser';
import { db } from '../lib/db';

interface EditorProps {
  project: Project;
  onExit: () => void;
}

type TabType = 'audio' | 'visualizer' | 'text' | 'background' | 'layers';
type FilterType = 'spectrum' | 'circular' | 'waves' | 'glow' | 'cyber' | 'particles' | 'shapes' | 'elements';

export const Editor: React.FC<EditorProps> = ({ project: initialProject, onExit }) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('visualizer');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('spectrum');
  const [subtitleTab, setSubtitleTab] = useState<'basic' | 'templates'>('templates');
  const [draggedSubtitleIndex, setDraggedSubtitleIndex] = useState<number | null>(null);
  const recorderRef = useRef<Recorder | null>(null);
  const rendererRef = useRef<CanvasRendererRef>(null);

  const {
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    getAudioData,
    getWaveformData,
    audioContext,
    audioRef,
    sourceNode,
    volume,
    setVolume
  } = useAudioAnalyzer({ audioUrl });

  // Auto-save
  useEffect(() => {
    db.saveProject(project);
  }, [project]);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleSrtUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      const subtitles = parseSRT(text);
      
      const hasSubtitleEl = project.elements.some(el => el.type === 'subtitle');
      const newElements = [...project.elements];
      let newSelectedId = selectedElementId;
      
      if (!hasSubtitleEl) {
        const subElId = crypto.randomUUID();
        newSelectedId = subElId;
        newElements.push({
          id: subElId,
          type: 'subtitle',
          x: project.resolution?.width ? project.resolution.width / 2 : 640,
          y: project.resolution?.height ? project.resolution.height - 100 : 620,
          scale: 1,
          rotation: 0,
          color: '#ffffff',
          opacity: 1,
          fontSize: 32,
          fontFamily: 'Inter',
        } as any); // Cast as any because SubtitleElement will be correctly inferred but TypeScript might complain about missing properties depending on BaseElement structure
      }
      
      setProject(prev => ({
        ...prev,
        subtitles,
        elements: newElements
      }));
      setSelectedElementId(newSelectedId);
      setActiveTab('text');
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      setProject({
        ...project,
        backgroundConfig: { type: isVideo ? 'video' : 'image', value: url }
      });
    }
  };

  const addElement = (type: VizElement['type']) => {
    const newEl: any = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 1280 / 2, // center of 720p canvas
      y: 720 / 2,
      scale: 1,
      rotation: 0,
      color: '#ffffff',
      opacity: 1,
    };

    if (type === 'bars') {
      newEl.width = 400;
      newEl.height = 200;
      newEl.barWidth = 10;
      newEl.barSpacing = 5;
    } else if (type === 'circle') {
      newEl.radius = 150;
      newEl.lineWidth = 4;
    } else if (type === 'text') {
      newEl.text = 'New Text';
      newEl.fontSize = 60;
      newEl.fontFamily = 'Arial';
    } else if (type === 'waveform') {
      newEl.width = 800;
      newEl.height = 200;
      newEl.lineWidth = 3;
    } else if (type === 'particles') {
      newEl.count = 100;
      newEl.speed = 1;
    } else if (type === 'orbs') {
      newEl.count = 5;
      newEl.radius = 50;
    } else if (type === 'neon_grid') {
      newEl.width = 1280;
      newEl.height = 720;
      newEl.perspective = 1.5;
    } else if (type === 'double_circle') {
      newEl.radius = 150;
      newEl.lineWidth = 4;
    } else if (type === 'smooth_curve') {
      newEl.width = 800;
      newEl.height = 200;
      newEl.lineWidth = 3;
    } else if (type === 'circular_spectrum') {
      newEl.radius = 150;
      newEl.height = 50;
    } else if (type === 'symmetrical_mirror') {
      newEl.width = 800;
      newEl.height = 200;
      newEl.barWidth = 5;
      newEl.barSpacing = 2;
    } else if (type === 'bass_pulse') {
      newEl.radius = 100;
    } else if (type === 'multi_sine') {
      newEl.width = 800;
      newEl.height = 200;
      newEl.lines = 3;
    } else if (type === 'spiral_galaxy') {
      newEl.count = 200;
      newEl.radius = 300;
    } else if (type === 'flames') {
      newEl.width = 800;
      newEl.height = 300;
    } else if (type === 'rain') {
      newEl.count = 300;
      newEl.speed = 1.5;
    } else if (type === 'triangle_spectrum' || type === 'diamond_spectrum' || type === 'glowing_ring') {
      newEl.radius = 150;
      newEl.lineWidth = 4;
    } else if (type === 'mirrored_bars') {
      newEl.width = 800;
      newEl.height = 200;
      newEl.barWidth = 6;
      newEl.barSpacing = 4;
    }

    setProject({
      ...project,
      elements: [...project.elements, newEl]
    });
    setSelectedElementId(newEl.id);
  };

  const updateElement = (id: string, updates: Partial<VizElement>) => {
    setProject(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el)
    }));
  };

  const removeElement = (id: string) => {
    setProject(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id)
    }));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      const blob = await recorderRef.current.stop();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '_')}_export.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setIsRecording(false);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      const canvas = rendererRef.current?.getCanvas();
      if (canvas && audioContext && sourceNode) {
        // Need to create a destination node for recording
        const dest = audioContext.createMediaStreamDestination();
        
        // Connect the existing source to destination (for recording)
        sourceNode.connect(dest);
        
        recorderRef.current = new Recorder(canvas, audioContext, dest);
        recorderRef.current.start();
        setIsRecording(true);
        setSelectedElementId(null);
        if (!isPlaying) togglePlay(); // Start playing automatically
      }
    }
  };

  useEffect(() => {
    // Auto-stop recording when audio finishes
    if (isRecording && !isPlaying && duration > 0 && currentTime >= duration - 0.5) {
      stopRecording();
    }
  }, [isRecording, isPlaying, duration, currentTime]);

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    const cs = Math.floor((time % 1) * 100);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${cs.toString().padStart(2, '0')}`;
  };

  const resolutions = [
    { label: '720p HD (16:9)', width: 1280, height: 720 },
    { label: '1080p Full HD (16:9)', width: 1920, height: 1080 },
    { label: '2160p 4K (16:9)', width: 3840, height: 2160 },
    { label: 'Square (1:1 Instagram)', width: 1080, height: 1080 },
    { label: 'Portrait (9:16 Reels)', width: 1080, height: 1920 }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0C] text-gray-200 font-sans overflow-hidden">
      {/* Topbar */}
      <header className="flex items-center justify-between px-8 h-16 bg-[#0D0D10] border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white" title="Home">
            <Home size={18} />
          </button>
          <div className="border-l border-white/10 pl-3 ml-1">
            <h1 className="text-sm font-semibold text-white tracking-tight">{project.name}</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">Project Editor</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-gray-500 uppercase">Resolution</span>
            <select 
              className="bg-[#1A1A1F] text-gray-300 border border-white/10 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
              value={`${project.resolution?.width || 1280}x${project.resolution?.height || 720}`}
              onChange={(e) => {
                const [w, h] = e.target.value.split('x').map(Number);
                setProject(prev => ({ ...prev, resolution: { width: w, height: h } }));
              }}
              disabled={isRecording}
            >
              {resolutions.map(r => (
                <option key={`${r.width}x${r.height}`} value={`${r.width}x${r.height}`}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <button 
            onClick={toggleRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              isRecording 
                ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30' 
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            {isRecording ? <Square size={16} /> : <Download size={16} />}
            {isRecording ? 'Stop Recording' : 'Record Video'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Controls */}
        <aside className="w-80 flex flex-col bg-[#111111] border-r border-white/5 overflow-hidden">
          {/* Tabs */}
          <div className="flex w-full border-b border-white/5">
            <button 
              onClick={() => setActiveTab('audio')} 
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 text-[10px] font-bold tracking-wider transition-colors border-b-2 ${activeTab === 'audio' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              <Music size={18} className={activeTab === 'audio' ? 'text-white' : 'text-gray-500'} /> AUDIO
            </button>
            <button 
              onClick={() => setActiveTab('visualizer')} 
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 text-[10px] font-bold tracking-wider transition-colors border-b-2 ${activeTab === 'visualizer' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              <Radio size={18} className={activeTab === 'visualizer' ? 'text-white' : 'text-gray-500'} /> VISUALIZER
            </button>
            <button 
              onClick={() => setActiveTab('text')} 
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 text-[10px] font-bold tracking-wider transition-colors border-b-2 ${activeTab === 'text' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              <Type size={18} className={activeTab === 'text' ? 'text-white' : 'text-gray-500'} /> TEXT
            </button>
            <button 
              onClick={() => setActiveTab('background')} 
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 text-[10px] font-bold tracking-wider transition-colors border-b-2 ${activeTab === 'background' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              <ImageIcon size={18} className={activeTab === 'background' ? 'text-white' : 'text-gray-500'} /> BACKGROUND
            </button>
            <button 
              onClick={() => setActiveTab('layers')} 
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 text-[10px] font-bold tracking-wider transition-colors border-b-2 ${activeTab === 'layers' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              <Layers size={18} className={activeTab === 'layers' ? 'text-white' : 'text-gray-500'} /> LAYERS
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col">
            {activeTab === 'audio' && (
              <div className="p-6 space-y-4">
                <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Audio Settings</h2>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                  <div>
                    <label className="block text-xs mb-1 text-gray-400">Audio Track</label>
                    <input type="file" accept="audio/*" onChange={handleAudioUpload} className="block w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 cursor-pointer" />
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs text-gray-400">Subtitle File (.srt)</label>
                      {project.subtitles && project.subtitles.length > 0 && (
                        <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">{project.subtitles.length} lines</span>
                      )}
                    </div>
                    <input type="file" accept=".srt" onChange={handleSrtUpload} className="block w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 cursor-pointer" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'background' && (
              <div className="flex flex-col h-full overflow-hidden p-4">
                <input type="file" id="hidden-bg-image-upload" accept="image/*" className="hidden" onChange={handleBgUpload} />
                <input type="file" id="hidden-bg-video-upload" accept="video/*" className="hidden" onChange={handleBgUpload} />
                <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                  {/* Tipe Background */}
                  <div>
                    <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold flex items-center gap-2 mb-4">
                      <Settings size={12} /> TIPE BACKGROUND
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { type: 'cyber_grid', name: 'Cyber Grid' },
                        { type: 'particle_starfield', name: 'Particle Starfield' },
                        { type: 'animated_gradient', name: 'Animated Gradient' },
                        { type: 'minimal_grid', name: 'Minimal Grid' },
                        { type: 'solid_color', name: 'Solid Color' },
                        { type: 'linear_gradient', name: 'Linear Gradient' },
                        { type: 'image', name: 'Image Background' },
                        { type: 'video', name: 'Video Background' },
                      ].map(bg => (
                        <button
                          key={bg.type}
                          onClick={() => {
                            if (bg.type === 'image') {
                              document.getElementById('hidden-bg-image-upload')?.click();
                            } else if (bg.type === 'video') {
                              document.getElementById('hidden-bg-video-upload')?.click();
                            } else {
                              setProject({
                                ...project,
                                backgroundConfig: { ...project.backgroundConfig, type: bg.type as BackgroundType }
                              });
                            }
                          }}
                          className={`p-3 border rounded-lg text-left transition-colors flex flex-col justify-center ${
                            project.backgroundConfig.type === bg.type
                              ? 'bg-[#1A1A1A] border-blue-500/50 text-white'
                              : 'bg-[#1A1A1A] border-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-xs font-bold">{bg.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter & Efek Background */}
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold flex items-center gap-2 mb-4">
                      <Settings size={12} /> FILTER & EFEK BACKGROUND
                    </h3>
                    <div className="space-y-4">
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-400">Blur Background</span>
                          <span className="text-[10px] text-white">{project.backgroundConfig.blur || 0}px</span>
                        </div>
                        <input type="range" min="0" max="100" value={project.backgroundConfig.blur || 0} onChange={e => setProject({ ...project, backgroundConfig: { ...project.backgroundConfig, blur: Number(e.target.value) } })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" />
                      </label>
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-400">Kecerahan (Brightness)</span>
                          <span className="text-[10px] text-white">{project.backgroundConfig.brightness ?? 100}%</span>
                        </div>
                        <input type="range" min="0" max="200" value={project.backgroundConfig.brightness ?? 100} onChange={e => setProject({ ...project, backgroundConfig: { ...project.backgroundConfig, brightness: Number(e.target.value) } })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" />
                      </label>
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-400">Kontras (Contrast)</span>
                          <span className="text-[10px] text-white">{project.backgroundConfig.contrast ?? 100}%</span>
                        </div>
                        <input type="range" min="0" max="200" value={project.backgroundConfig.contrast ?? 100} onChange={e => setProject({ ...project, backgroundConfig: { ...project.backgroundConfig, contrast: Number(e.target.value) } })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" />
                      </label>
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-400">Vignette Border</span>
                          <span className="text-[10px] text-white">{project.backgroundConfig.vignette || 0}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={project.backgroundConfig.vignette || 0} onChange={e => setProject({ ...project, backgroundConfig: { ...project.backgroundConfig, vignette: Number(e.target.value) } })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="flex flex-col h-full overflow-hidden p-4">
                <button onClick={() => addElement('text')} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-center transition-colors text-white font-bold text-sm mb-4">
                  + TAMBAH LAYER TEKS BARU
                </button>

                <div className="flex-1 overflow-y-auto pr-1">
                  {selectedElementId && (project.elements.find(e => e.id === selectedElementId)?.type === 'text' || project.elements.find(e => e.id === selectedElementId)?.type === 'subtitle') ? (
                    (() => {
                      const el = project.elements.find(e => e.id === selectedElementId) as any;
                      const isSubtitle = el.type === 'subtitle';
                      return (
                        <div className="space-y-4">
                          <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                            <Type size={12} /> {isSubtitle ? "EDIT SUBTITLE LAYER" : "EDIT LAYER TEKS (TEXT LAYER)"}
                          </h3>
                          
                          {!isSubtitle && (
    <div>
      <label className="block text-[10px] text-gray-400 mb-1">Isi Teks</label>
      <input type="text" value={el.text || ''} onChange={e => updateElement(el.id, { text: e.target.value })} className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />
    </div>
  )}
  {isSubtitle && (
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
        <div 
          key={sub.id} 
          draggable
          onDragStart={(e) => setDraggedSubtitleIndex(index)}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedSubtitleIndex === null || draggedSubtitleIndex === index) return;
            const newSubs = [...(project.subtitles || [])];
            const draggedSub = newSubs[draggedSubtitleIndex];
            newSubs.splice(draggedSubtitleIndex, 1);
            newSubs.splice(index, 0, draggedSub);
            setProject(prev => ({ ...prev, subtitles: newSubs }));
            setDraggedSubtitleIndex(null);
          }}
          className={`bg-[#1A1A1A]/80 border ${draggedSubtitleIndex === index ? 'border-blue-500 opacity-50' : 'border-white/5'} rounded-lg p-3 flex flex-col gap-2 cursor-move hover:border-white/20 transition-colors`}
        >
          <div className="flex justify-center -mt-1 mb-1 cursor-move text-white/20 hover:text-white/40">
            <div className="w-8 h-1 rounded-full bg-current"></div>
          </div>
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
  )}

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] text-gray-400">Font Family (Google Fonts)</label>
                              <button className="text-[10px] text-blue-500 font-bold uppercase hover:text-blue-400 flex items-center gap-1">
                                UPLOAD FONT
                              </button>
                            </div>
                            <select value={el.fontFamily} onChange={e => updateElement(el.id, { fontFamily: e.target.value })} className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none">
                              <option value="Montserrat">Montserrat (sans-serif)</option>
                              <option value="Inter">Inter (sans-serif)</option>
                              <option value="Roboto">Roboto (sans-serif)</option>
                              <option value="Arial">Arial (sans-serif)</option>
                              <option value="Courier New">Courier New (monospace)</option>
                            </select>
                          </div>

                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="block">
                                <div className="flex justify-between mb-1">
                                  <span className="text-[10px] text-gray-400">Ukuran Font ({el.fontSize}px)</span>
                                </div>
                                <input type="range" min="12" max="200" value={el.fontSize} onChange={e => updateElement(el.id, { fontSize: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" />
                              </label>
                            </div>
                            <div className="flex-1">
                              <label className="block">
                                <div className="flex justify-between mb-1">
                                  <span className="text-[10px] text-gray-400">Letter Spacing ({el.letterSpacing || 0}px)</span>
                                </div>
                                <input type="range" min="-10" max="50" value={el.letterSpacing || 0} onChange={e => updateElement(el.id, { letterSpacing: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" />
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-400 mb-2">Warna & Gradient Teks</label>
                            <div className="flex items-center gap-3">
                              <input type="color" value={el.color} onChange={e => updateElement(el.id, { color: e.target.value })} className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent" />
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={el.useGradient || false} onChange={e => updateElement(el.id, { useGradient: e.target.checked })} className="rounded bg-[#1A1A1A] border-white/10 text-blue-500 focus:ring-blue-500" />
                                <span className="text-xs text-gray-300">Gunakan Gradient Teks</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">Animasi Teks</label>
                            <select value={el.animation || 'none'} onChange={e => updateElement(el.id, { animation: e.target.value as any })} className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none">
                              <option value="none">Tidak Ada</option>
                              <option value="glow_pulse">Glow Pulse</option>
                              <option value="bounce">Bounce</option>
                              <option value="wave">Wave</option>
                            </select>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center text-gray-500 text-xs py-8">
                      Pilih layer teks dari daftar layers atau tambah baru.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'layers' && (
              <div className="p-6">
                <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-4">Layers</h2>
                {project.elements.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No elements added.</p>
                ) : (
                  <div className="space-y-2">
                    {project.elements.map(el => (
                      <div 
                        key={el.id} 
                        onClick={() => setSelectedElementId(el.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors flex justify-between items-center ${
                          selectedElementId === el.id 
                            ? 'bg-blue-500/10 border-blue-500/50' 
                            : 'bg-white/5 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="font-medium text-xs text-white capitalize">{el.type.replace('_', ' ')}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeElement(el.id); }} 
                          className="text-gray-400 hover:text-rose-400 p-1"
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'visualizer' && (
              <div className="flex flex-col h-full overflow-hidden p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Cari preset visualizer (50+ preset)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {(['spectrum', 'circular', 'waves', 'glow', 'cyber', 'particles', 'shapes', 'elements'] as FilterType[]).map(filter => (
                    <button 
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`w-full py-2 px-1 text-[9px] sm:text-[10px] font-bold uppercase rounded transition-colors flex items-center justify-center text-center leading-tight ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-[#1A1A1A] text-gray-400 border border-white/5 hover:bg-white/10'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4 pr-1 no-scrollbar">
                  {([
                    { type: 'bars', name: 'Linear Bars', category: 'spectrum', label: 'SPECTRUM' },
                    { type: 'smooth_curve', name: 'Smooth Curve', category: 'spectrum', label: 'SPECTRUM' },
                    { type: 'symmetrical_mirror', name: 'Symmetrical Mirror', category: 'spectrum', label: 'SPECTRUM' },
                    { type: 'waveform', name: 'Waveform', category: 'spectrum', label: 'SPECTRUM' },
                    { type: 'mirrored_bars', name: 'Mirrored Bars', category: 'spectrum', label: 'SPECTRUM' },
                    { type: 'circle', name: 'Radial Circle', category: 'circular', label: 'CIRCULAR' },
                    { type: 'double_circle', name: 'Double Circle Ring', category: 'circular', label: 'CIRCULAR' },
                    { type: 'circular_spectrum', name: 'Circular Spectrum', category: 'circular', label: 'CIRCULAR' },
                    { type: 'bass_pulse', name: 'Bass Pulse Rings', category: 'circular', label: 'CIRCULAR' },
                    { type: 'triangle_spectrum', name: 'Triangle Spectrum', category: 'shapes', label: 'SHAPE' },
                    { type: 'diamond_spectrum', name: 'Diamond Spectrum', category: 'shapes', label: 'SHAPE' },
                    { type: 'glowing_ring', name: 'Glowing Ring', category: 'glow', label: 'GLOW' },
                    { type: 'neon_grid', name: 'Neon Synthwave', category: 'cyber', label: 'CYBER' },
                    { type: 'orbs', name: 'Frequency Orbs', category: 'cyber', label: 'ORBS & GLOW' },
                    { type: 'particles', name: 'Particle Explosion', category: 'particles', label: 'PARTICLES' },
                    { type: 'spiral_galaxy', name: 'Spiral Galaxy', category: 'particles', label: 'PARTICLES' },
                    { type: 'multi_sine', name: 'Multi Sine Waves', category: 'waves', label: 'WAVES' },
                    { type: 'flames', name: 'Flames Column', category: 'elements', label: 'ELEMENTS' },
                    { type: 'rain', name: 'Rain Ripples', category: 'elements', label: 'ELEMENTS' },
                  ] as const)
                    .filter(item => (activeFilter === 'all' || item.category === activeFilter) && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(item => (
                      <button 
                        key={item.type}
                        onClick={() => addElement(item.type)} 
                        className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500/50 rounded-xl text-left transition-colors flex flex-col gap-1.5 min-h-[70px] justify-center"
                      >
                        <span className="text-xs font-bold text-gray-200">{item.name}</span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest">{item.label}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0C] p-8 gap-8 overflow-y-auto">
          {/* Canvas Wrapper */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl">
              <CanvasRenderer 
                ref={rendererRef}
                project={project}
                getAudioData={getAudioData}
                getWaveformData={getWaveformData}
                isPlaying={isPlaying || isRecording}
                isRecording={isRecording}
                currentTime={currentTime}
                selectedElementId={selectedElementId}
                onUpdateElement={updateElement}
                onSelectElement={setSelectedElementId}
              />
            </div>
          </div>

          {/* Timeline & Player */}
          <div className="bg-[#121216] border border-white/10 rounded-2xl p-4 flex items-center gap-6">
            <div className="flex items-center gap-2 font-mono text-sm tracking-widest shrink-0">
              <span className="text-[#3b82f6]">{formatTime(currentTime)}</span>
              <span className="text-gray-600">/</span>
              <span className="text-gray-400">{formatTime(duration)}</span>
            </div>
            
            <div className="flex-1 flex items-center gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => seek(0)}
                  disabled={!audioUrl}
                  className="w-10 h-10 flex items-center justify-center border border-white/10 hover:bg-white/5 text-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipBack size={18} />
                </button>
                <button 
                  onClick={togglePlay}
                  disabled={!audioUrl}
                  className="w-10 h-10 flex items-center justify-center bg-[#2563eb] hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
              </div>
              
              <div className="flex-1 flex items-center group relative h-6">
                  <input 
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="absolute w-full h-full appearance-none cursor-pointer z-10 opacity-0"
                  />
                  <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden pointer-events-none relative z-0">
                    <div 
                      className="h-full bg-[#3b82f6]" 
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <div 
                    className="absolute h-3 w-3 bg-[#3b82f6] rounded-full shadow pointer-events-none z-0 transform -translate-y-1/2 -translate-x-1/2 top-1/2" 
                    style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
              </div>
              
              <div className="flex items-center gap-2 shrink-0 ml-4 w-24 group relative">
                <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-gray-400 hover:text-white transition-colors">
                  {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <div className="flex-1 relative h-6 flex items-center">
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="absolute w-full h-full appearance-none cursor-pointer z-10 opacity-0"
                  />
                  <div className="w-full h-1 bg-[#2a2a2a] rounded-full overflow-hidden pointer-events-none">
                    <div className="h-full bg-[#3b82f6]" style={{ width: `${volume * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Properties or Analytics */}
        <aside className="w-80 flex flex-col bg-[#0D0D10] border-l border-white/5 overflow-y-auto">
          {selectedElementId ? (() => {
            const el = project.elements.find(e => e.id === selectedElementId);
            if (!el) return null;
            return (
              <div className="p-6 space-y-8">
                <div>
                  <h2 className="text-sm font-semibold text-white capitalize mb-1">{el.type} Element</h2>
                  <span className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded uppercase tracking-wider">VISUALIZER</span>
                </div>

                {/* Transform */}
                <div className="space-y-4">
                  <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                    <Settings size={12} /> Transform & Posisi
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-[10px] text-gray-500 mb-1 block">Posisi X (px)</span>
                      <input type="number" value={el.x} onChange={e => updateElement(el.id, { x: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] text-gray-500 mb-1 block">Posisi Y (px)</span>
                      <input type="number" value={el.y} onChange={e => updateElement(el.id, { y: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                    </label>
                  </div>
                  <label className="block">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-gray-500">Scale ({Math.round((el.scale || 1) * 100)}%)</span>
                    </div>
                    <input type="range" min="0.1" max="3" step="0.1" value={el.scale || 1} onChange={e => updateElement(el.id, { scale: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                  </label>
                  <label className="block">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-gray-500">Rotasi ({el.rotation || 0}°)</span>
                    </div>
                    <input type="range" min="-180" max="180" value={el.rotation || 0} onChange={e => updateElement(el.id, { rotation: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                  </label>
                  <label className="block">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-gray-500">Opasitas ({Math.round(el.opacity * 100)}%)</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={el.opacity} onChange={e => updateElement(el.id, { opacity: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                  </label>
                </div>

                
                {el.type === 'subtitle' && (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2 p-1 bg-black/40 rounded-lg">
                      <button 
                        onClick={() => setSubtitleTab('basic')}
                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded ${subtitleTab === 'basic' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        Basic
                      </button>
                      <button 
                        onClick={() => setSubtitleTab('templates')}
                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded ${subtitleTab === 'templates' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
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
                          <button onClick={() => updateElement(el.id, { templateStyle: 'tiktok_pop', color: '#ffffff' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="text-white font-bold text-xs" style={{textShadow: '2px 2px 0px #000000'}}>POP-UP</span>
                          </button>
                          <button onClick={() => updateElement(el.id, { templateStyle: 'tiktok_karaoke', color: '#00ff00' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="text-white font-bold text-xs" style={{textShadow: '2px 2px 0px #000000'}}>KARAOKE</span>
                          </button>
                          <button onClick={() => updateElement(el.id, { templateStyle: 'tiktok_shadow', color: '#ffffff' })} className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-blue-500 rounded flex items-center justify-center min-h-[60px]">
                            <span className="text-white font-bold text-[10px]" style={{textShadow: '-2px 0px 0px #00ffff, 2px 0px 0px #ff0050'}}>TIKTOK</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Specific Properties */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                    <Settings size={12} /> Properti Visualizer ({el.type})
                  </h3>
                  <label className="block">
                    <span className="text-[10px] text-gray-500 mb-2 block">Warna Utama</span>
                    <input type="color" value={el.color} onChange={e => updateElement(el.id, { color: e.target.value })} className="block w-full h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                  </label>
                  
                  <div className="flex items-center gap-2 mt-2 mb-2">
                    <input 
                      type="checkbox" 
                      id={`gradient-${el.id}`}
                      checked={el.useGradient || false} 
                      onChange={e => updateElement(el.id, { useGradient: e.target.checked })}
                      className="rounded bg-black/50 border-white/10 text-indigo-500"
                    />
                    <label htmlFor={`gradient-${el.id}`} className="text-[10px] text-gray-400 cursor-pointer">Gunakan Gradient (2 Warna)</label>
                  </div>
                  
                  {el.useGradient && (
                    <label className="block mt-2">
                      <span className="text-[10px] text-gray-500 mb-2 block">Warna Kedua (Gradient)</span>
                      <input type="color" value={el.color2 || '#ffffff'} onChange={e => updateElement(el.id, { color2: e.target.value })} className="block w-full h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                    </label>
                  )}
                  
                  {(el.type === 'text' || el.type === 'subtitle') && (
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
                  )}
                  
                  {el.type === 'bars' && (
                    <label className="block">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-gray-500">Tinggi Max ({el.height}px)</span>
                      </div>
                      <input type="range" min="50" max="600" value={el.height} onChange={e => updateElement(el.id, { height: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                    </label>
                  )}

                  {el.type === 'circle' && (
                    <label className="block">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-gray-500">Radius ({el.radius}px)</span>
                      </div>
                      <input type="range" min="20" max="400" value={el.radius} onChange={e => updateElement(el.id, { radius: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                    </label>
                  )}

                  {el.type === 'particles' && (
                    <>
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-500">Jumlah Partikel ({el.count})</span>
                        </div>
                        <input type="range" min="10" max="500" value={el.count} onChange={e => updateElement(el.id, { count: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                      </label>
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-500">Kecepatan ({el.speed}x)</span>
                        </div>
                        <input type="range" min="0.1" max="5" step="0.1" value={el.speed} onChange={e => updateElement(el.id, { speed: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                      </label>
                    </>
                  )}

                  {el.type === 'orbs' && (
                    <>
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-500">Jumlah Orb ({el.count})</span>
                        </div>
                        <input type="range" min="1" max="20" value={el.count} onChange={e => updateElement(el.id, { count: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                      </label>
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-500">Radius Base ({el.radius}px)</span>
                        </div>
                        <input type="range" min="10" max="200" value={el.radius} onChange={e => updateElement(el.id, { radius: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                      </label>
                    </>
                  )}

                  {el.type === 'neon_grid' && (
                    <label className="block">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-gray-500">Perspektif ({el.perspective})</span>
                      </div>
                      <input type="range" min="0.5" max="3" step="0.1" value={el.perspective} onChange={e => updateElement(el.id, { perspective: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                    </label>
                  )}

                  {(el.type === 'double_circle' || el.type === 'circular_spectrum' || el.type === 'bass_pulse' || el.type === 'spiral_galaxy' || el.type === 'triangle_spectrum' || el.type === 'diamond_spectrum' || el.type === 'glowing_ring') && (
                    <label className="block">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-gray-500">Radius ({el.radius}px)</span>
                      </div>
                      <input type="range" min="20" max="400" value={el.radius} onChange={e => updateElement(el.id, { radius: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                    </label>
                  )}

                  {(el.type === 'smooth_curve' || el.type === 'symmetrical_mirror' || el.type === 'multi_sine' || el.type === 'flames' || el.type === 'waveform' || el.type === 'mirrored_bars') && (
                    <label className="block">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-gray-500">Tinggi Max ({el.height}px)</span>
                      </div>
                      <input type="range" min="50" max="600" value={el.height} onChange={e => updateElement(el.id, { height: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                    </label>
                  )}
                  
                  {el.type === 'rain' && (
                    <>
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-500">Jumlah Drop ({el.count})</span>
                        </div>
                        <input type="range" min="50" max="1000" value={el.count} onChange={e => updateElement(el.id, { count: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                      </label>
                      <label className="block">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-gray-500">Kecepatan ({el.speed}x)</span>
                        </div>
                        <input type="range" min="0.1" max="5" step="0.1" value={el.speed} onChange={e => updateElement(el.id, { speed: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                      </label>
                    </>
                  )}
                  
                  {el.type === 'multi_sine' && (
                    <label className="block">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-gray-500">Jumlah Gelombang ({el.lines})</span>
                      </div>
                      <input type="range" min="1" max="10" value={el.lines} onChange={e => updateElement(el.id, { lines: Number(e.target.value) })} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                    </label>
                  )}
                </div>
              </div>
            );
          })() : (
            <div className="p-6 space-y-6">
              <AnalyticsDashboard 
                getAudioData={getAudioData}
                getWaveformData={getWaveformData}
                isPlaying={isPlaying || isRecording}
              />
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mt-auto">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Project Info</h3>
                <p className="text-xs text-gray-500 mb-1.5">Name: <span className="text-gray-300 font-medium">{project.name}</span></p>
                <p className="text-xs text-gray-500 mb-1.5">Elements: <span className="text-gray-300 font-medium">{project.elements.length}</span></p>
                <p className="text-xs text-gray-500">Last updated: <span className="text-gray-300 font-medium">{new Date(project.updatedAt).toLocaleTimeString()}</span></p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
