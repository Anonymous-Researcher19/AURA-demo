import React, { useState, useRef } from 'react';
import { Play, Pause, ChevronDown, ChevronUp, Music, Speaker, Mic2, Info, BarChart3, Layers, Database, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

interface MainComparisonRow {
  modelName: string;
  base: string;
  vanillaRAG: string;
  aura: string;
  target: string;
}

interface MainDemoSample {
  id: string;
  prompt: string;
  rows: MainComparisonRow[];
}

interface AblationVariant {
  name: string;
  url: string;
}

interface AblationSample {
  id: string;
  prompt: string;
  variants: AblationVariant[];
}

// --- Mock Data / Placeholders ---
// User should replace these URLs with their actual experimental results.

const MAIN_DEMOS: MainDemoSample[] = [
  {
    id: 'm1',
    prompt: "A relaxing and ambient instrumental background track with soft piano.",
    rows: [
      { modelName: 'AudioLDM', base: '/audio/000087_AudioLDM1_TextOnly.wav', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'AudioLDM2', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'MusicGen', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
    ]
  },
  {
    id: 'm2',
    prompt: "An energetic electronic dance track with heavy bass and rhythmic synthesizer patterns.",
    rows: [
      { modelName: 'AudioLDM', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'AudioLDM2', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'MusicGen', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
    ]
  },
  {
    id: 'm3',
    prompt: "A cinematic orchestral piece with dramatic brass and epic percussion for a movie scene.",
    rows: [
      { modelName: 'AudioLDM', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'AudioLDM2', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'MusicGen', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
    ]
  },
  {
    id: 'm4',
    prompt: "A lo-fi hip hop beat with a chill atmosphere, featuring a smooth electric piano melody.",
    rows: [
      { modelName: 'AudioLDM', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'AudioLDM2', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'MusicGen', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
    ]
  },
  {
    id: 'm5',
    prompt: "Upbeat jazz fusion with a fast-paced drum solo and a vibrant saxophone lead.",
    rows: [
      { modelName: 'AudioLDM', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'AudioLDM2', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'MusicGen', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
    ]
  },
  {
    id: 'm6',
    prompt: "Ethereal vocal chops layered over a deep, pulsing synth pad and minimal percussion.",
    rows: [
      { modelName: 'AudioLDM', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'AudioLDM2', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'MusicGen', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
    ]
  },
  {
    id: 'm7',
    prompt: "Traditional folk music featuring an acoustic guitar, a fiddle, and a warm, rustic feel.",
    rows: [
      { modelName: 'AudioLDM', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'AudioLDM2', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'MusicGen', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
    ]
  },
  {
    id: 'm8',
    prompt: "Futuristic sci-fi soundscape with glitchy textures and metallic echoing sounds.",
    rows: [
      { modelName: 'AudioLDM', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'AudioLDM2', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'MusicGen', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
    ]
  },
  {
    id: 'm9',
    prompt: "A bright and happy pop track with a catchy synth hook and energetic handclaps.",
    rows: [
      { modelName: 'AudioLDM', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'AudioLDM2', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'MusicGen', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
    ]
  },
  {
    id: 'm10',
    prompt: "Deep meditation music with Tibetan singing bowls and a constant low-frequency hum.",
    rows: [
      { modelName: 'AudioLDM', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'AudioLDM2', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
      { modelName: 'MusicGen', base: '#', vanillaRAG: '#', aura: '#', target: '#' },
    ]
  },
];

const ABLATION_DEMOS: AblationSample[] = [
  {
    id: 'a1',
    prompt: "Prompt A: Peaceful nature soundscape with birds and wind.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a2',
    prompt: "Prompt B: Dark and mysterious ambient drone for a thriller.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a3',
    prompt: "Prompt C: High-energy rock riff with distorted electric guitar.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a4',
    prompt: "Prompt D: Gentle rain falling on a tin roof with distant thunder.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a5',
    prompt: "Prompt E: Busy city street with car horns and chatter.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a6',
    prompt: "Prompt F: Soft acoustic guitar strumming in a large hall.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a7',
    prompt: "Prompt G: Fast-paced drum and bass with glitchy synth stabs.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a8',
    prompt: "Prompt H: Ethereal choir singing in a cathedral with long reverb.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a9',
    prompt: "Prompt I: Retro 8-bit video game music with a bouncy melody.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a10',
    prompt: "Prompt J: Deep sea underwater bubbles and whale calls.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a11',
    prompt: "Prompt K: Funky bassline with a wah-wah guitar effect.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a12',
    prompt: "Prompt L: Space station hum with mechanical whirring sounds.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  },
  {
    id: 'a13',
    prompt: "Prompt M: Classical string quartet playing a lively allegro.",
    variants: [
      { name: 'Target', url: '#' },
      { name: 'Base (MusicGen)', url: '#' },
      { name: '+ MAP (Track) + ASA', url: '#' },
      { name: '+ IAD', url: '#' },
      { name: '+ MAP (Chunk)', url: '#' },
      { name: 'AURA-Full (Ours)', url: '#' },
    ]
  }
];

// --- Components ---

const CompactAudioPlayer = ({ url, label }: { url: string; label: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-lg border border-slate-200 hover:bg-indigo-50 transition-colors group">
      <button
        onClick={togglePlay}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
          isPlaying ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-300 group-hover:border-indigo-300'
        }`}
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
      </button>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
      <audio ref={audioRef} src={url} onEnded={() => setIsPlaying(false)} className="hidden" />
    </div>
  );
};

const MainDemoCard = ({ sample }: { sample: MainDemoSample }) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-8">
    <div className="bg-slate-900 p-4">
      <p className="text-indigo-300 text-xs font-mono mb-1 uppercase tracking-widest">Text Prompt</p>
      <p className="text-white font-medium italic">"{sample.prompt}"</p>
    </div>
    <div className="p-4 overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
            <th className="text-left pb-4 pl-2">Backbone</th>
            <th className="pb-4">Base</th>
            <th className="pb-4">VanillaRAG</th>
            <th className="pb-4 text-indigo-600">AURA (Ours)</th>
            <th className="pb-4">Target</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sample.rows.map((row, i) => (
            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
              <td className="py-3 font-bold text-slate-700 pl-2">{row.modelName}</td>
              <td className="py-3 px-2"><CompactAudioPlayer url={row.base} label="Base" /></td>
              <td className="py-3 px-2"><CompactAudioPlayer url={row.vanillaRAG} label="RAG" /></td>
              <td className="py-3 px-2 bg-indigo-50/30"><CompactAudioPlayer url={row.aura} label="AURA" /></td>
              <td className="py-3 px-2"><CompactAudioPlayer url={row.target} label="Target" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AblationDemoTable = ({ samples }: { samples: AblationSample[] }) => (
  <div className="relative group">
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="sticky left-0 z-10 bg-slate-50 px-6 py-4 text-left font-bold text-slate-900 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Method (Variant)
            </th>
            {samples.map(s => (
              <th key={s.id} className="px-6 py-4 text-center font-medium text-slate-600 text-xs italic min-w-[240px]">
                {s.prompt}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {samples[0].variants.map((variant, vIdx) => (
            <tr key={vIdx} className={variant.name === 'Target' ? 'bg-slate-50/80' : variant.name.includes('Ours') ? 'bg-indigo-50/30' : ''}>
              <td className={`sticky left-0 z-10 px-6 py-4 font-bold border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${
                variant.name === 'Target' ? 'bg-slate-50/80 text-slate-500' : 
                variant.name.includes('Ours') ? 'bg-indigo-50 text-indigo-600' : 
                'bg-white text-slate-700'
              }`}>
                {variant.name}
              </td>
              {samples.map(s => (
                <td key={s.id} className="px-6 py-4 text-center">
                  <CompactAudioPlayer url={s.variants[vIdx].url} label="Play" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none animate-pulse flex flex-col items-center gap-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="bg-white/80 backdrop-blur p-2 rounded-full border border-slate-200 shadow-lg">
        <ChevronDown className="-rotate-90" size={20} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/80 backdrop-blur px-2 py-1 rounded border border-slate-200 shadow-lg">Scroll for more</span>
    </div>
  </div>
);

export default function App() {
  const [showAllMain, setShowAllMain] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl tracking-tighter uppercase">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">A</div>
            <span>AURA</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
            <a href="#abstract" className="hover:text-indigo-600 transition-colors">Abstract</a>
            <a href="#method" className="hover:text-indigo-600 transition-colors">Method</a>
            <a href="#main-demos" className="hover:text-indigo-600 transition-colors">Main Demos</a>
            <a href="#ablation" className="hover:text-indigo-600 transition-colors">Ablation</a>
          </div>
          <div className="text-[10px] font-mono text-slate-400">Anonymous Submission</div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-24 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
            AURA: Personalized Audio Generation via <span className="text-indigo-600">Aesthetic-intent</span> Retrieval and Alignment
          </h1>
          
          <div className="mb-8 inline-block">
            <a 
              href="https://github.com/Anonymous-Researcher19/AURA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all duration-300 shadow-sm"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-indigo-200 shadow-lg group-hover:scale-110 transition-transform">
                <Github size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest font-black opacity-60 leading-none mb-1">Open Source</p>
                <p className="text-sm font-bold">View Code on GitHub</p>
              </div>
            </a>
          </div>

          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A novel framework that moves beyond traditional content replication by constructing multi-scale aesthetic profiles to capture users' personalized "aesthetic genes."
          </p>
          <div className="flex justify-center gap-4">
            <a href="#main-demos" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
              View Experimental Results <ChevronDown size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Abstract */}
      <section id="abstract" className="py-16 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2 uppercase tracking-tight">
            <Info className="text-indigo-600" size={24} />
            Abstract
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg italic">
            "Text-to-Audio (TTA) generation technology has made significant strides in synthesizing high-quality audio content. However, most existing generative models adhere to a 'general-purpose generation' paradigm, resulting in outputs that exhibit marked aesthetic homogeneity... This paper proposes the AURA framework, the first general-purpose paradigm for personalized audio generation tasks, designed to accurately capture and incorporate users' personalized aesthetic preferences."
          </p>
        </div>
      </section>

      {/* Methodology */}
      <section id="method" className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Methodology</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Our framework comprises four key stages to achieve precise intent-aesthetic alignment.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: <Database />, title: 'MAP', desc: 'Multi-scale Aesthetic Profile Construction: Models user history via a dual-stream network to extract fine-grained aesthetic traits.' },
            { icon: <Speaker />, title: 'HAR', desc: 'Hybrid-intent Aesthetic Retrieval: Utilizes explicit-implicit dual pathways to filter candidate sets that match both semantic and aesthetic intent.' },
            { icon: <Mic2 />, title: 'IAD', desc: 'Intent-Driven Aesthetic Distillation: Refines aesthetic factors based on the current query to ensure relevance and coherence.' },
            { icon: <Layers />, title: 'ASA', desc: 'Lossless Aesthetic Semantic Alignment: Injects distilled traits into the diffusion generation process without compromising semantic integrity.' },
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="font-black text-lg mb-1">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-snug">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-center border border-slate-800 shadow-2xl">
          <div className="inline-block px-4 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-indigo-500/30">
            System Architecture
          </div>
          <div className="aspect-[21/9] bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700/50 border-dashed">
            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">[ Architecture Diagram Placeholder ]</p>
          </div>
        </div>
      </section>

      {/* Quantitative Results */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tight flex items-center justify-center gap-3">
              <BarChart3 className="text-indigo-600" />
              Quantitative Results
            </h2>
            <p className="text-slate-500">Performance comparison across different backbones (Table 2 from Paper).</p>
          </div>
          
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 font-bold text-slate-900">Backbone & Strategy</th>
                  <th className="px-6 py-4 font-bold text-slate-900 text-center">FAD ↓</th>
                  <th className="px-6 py-4 font-bold text-slate-900 text-center">CLAP-T ↑</th>
                  <th className="px-6 py-4 font-bold text-indigo-600 text-center">CLAP-A ↑</th>
                  <th className="px-6 py-4 font-bold text-slate-900 text-center">KL-Div ↓</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'AudioLDM 1 (TextOnly)', fad: '5.459', clapt: '0.131', clapa: '0.164', kl: '4.820' },
                  { name: 'AudioLDM 1 (VanillaRAG)', fad: '3.920', clapt: '0.180', clapa: '0.352', kl: '3.120' },
                  { name: 'AudioLDM 1 + AURA (Ours)', fad: '3.487', clapt: '0.215', clapa: '0.485', kl: '2.810', highlight: true },
                  { name: 'AudioLDM 2 (TextOnly)', fad: '3.250', clapt: '0.242', clapa: '0.271', kl: '3.450' },
                  { name: 'AudioLDM 2 + AURA (Ours)', fad: '3.320', clapt: '0.235', clapa: '0.502', kl: '2.510', highlight: true },
                  { name: 'MusicGen (TextOnly)', fad: '3.454', clapt: '0.272', clapa: '0.284', kl: '3.512' },
                  { name: 'MusicGen + AURA (Ours)', fad: '3.556', clapt: '0.254', clapa: '0.516', kl: '2.173', highlight: true },
                ].map((row, i) => (
                  <tr key={i} className={row.highlight ? 'bg-indigo-50/50' : ''}>
                    <td className={`px-6 py-4 font-medium ${row.highlight ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}>{row.name}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{row.fad}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{row.clapt}</td>
                    <td className="px-6 py-4 text-center text-indigo-600 font-bold">{row.clapa}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{row.kl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Spectrogram Analysis */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Spectrogram Visualization</h2>
            <p className="text-slate-500">Mel-spectrogram analysis of personalized audio generation (Figure 6 from Paper).</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Ground Truth', desc: 'Target aesthetic texture from user history, showing rich harmonic structure.' },
              { label: 'Baseline', desc: 'Suffers from rhythmic blurring and significant harmonic loss in high frequencies.' },
              { label: 'AURA (Ours)', desc: 'Successfully reconstructs sharp vertical transients and preserves aesthetic texture.' }
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/3] bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 shadow-xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors" />
                  <p className="text-slate-600 font-mono text-[10px] uppercase tracking-widest">[ Spectrogram {i + 1} ]</p>
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-slate-900">{item.label}</h4>
                  <p className="text-slate-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Demos */}
      <section id="main-demos" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Main Audio Comparisons</h2>
            <p className="text-slate-500">Comparison of AURA against Base and VanillaRAG across three backbone models.</p>
          </div>

          <div className="space-y-8">
            {(showAllMain ? MAIN_DEMOS : MAIN_DEMOS.slice(0, 3)).map(sample => (
              <div key={sample.id}>
                <MainDemoCard sample={sample} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAllMain(!showAllMain)}
              className="px-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2 mx-auto shadow-sm"
            >
              {showAllMain ? (
                <><ChevronUp size={20} /> Show Fewer Samples</>
              ) : (
                <><ChevronDown size={20} /> View All {MAIN_DEMOS.length} Samples</>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Ablation Demos */}
      <section id="ablation" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Ablation Study Audio</h2>
            <p className="text-slate-500">Evaluating the contribution of each component in the AURA framework.</p>
          </div>

          <AblationDemoTable samples={ABLATION_DEMOS} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 font-black text-xl tracking-tighter uppercase mb-6">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">A</div>
            <span>AURA</span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-8">
            AURA: Personalized Audio Generation via Aesthetic-intent Retrieval and Alignment
          </p>
          <div className="h-px bg-slate-200 w-24 mx-auto mb-8" />
          <p className="text-slate-400 text-[10px]">
            Anonymous submission for research purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
