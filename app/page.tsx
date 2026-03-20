"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Code, Eye } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"raw" | "preview">("preview");

  const extractUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    
    try {
      const res = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      
      if (data.error) {
        setResult(`Error: ${data.error}`);
        setView("raw");
      } else {
        setResult(data.markdown);
        setView("preview");
      }
    } catch (err) {
      setResult("Network Error. Could not fetch URL.");
      setView("raw");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-transparent to-[#050505] flex flex-col items-center">
      <main className="w-full max-w-4xl z-10 space-y-8 glass-panel p-8 rounded-2xl relative mt-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight glow-text pb-2">Feed AI Only What Matters.</h1>
          <p className="text-gray-400 text-lg">Send us a URL. We strip the noise, parse the DOM, and return perfect Markdown for your LLM context windows.</p>
        </div>

        <form onSubmit={extractUrl} className="space-y-4">
          <div className="relative">
            <input 
              type="url" 
              required 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://news.ycombinator.com/item?id=..." 
              className="w-full bg-[#111] border border-white/10 rounded-xl px-6 py-4 pr-32 text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-transparent text-neon px-6 py-2 rounded-lg font-medium hover:bg-neon hover:text-black transition-all btn-glow" disabled={loading}>
              {loading ? "Extracting..." : "Extract"}
            </button>
          </div>
        </form>

        {result && (
          <div className="space-y-4 animate-in fade-in duration-300 mt-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              
              <div className="flex space-x-2 bg-black/50 p-1 rounded-lg border border-white/5">
                <button 
                  onClick={() => setView("preview")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-all ${view === 'preview' ? 'bg-[#222] text-neon shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  <Eye size={16} /> <span>Preview</span>
                </button>
                <button 
                  onClick={() => setView("raw")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-all ${view === 'raw' ? 'bg-[#222] text-neon shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  <Code size={16} /> <span>Raw Markdown</span>
                </button>
              </div>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                }}
                className="flex items-center space-x-2 text-sm border border-gray-600 px-4 py-2 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all text-gray-300 group"
              >
                <Copy size={16} className="group-hover:text-neon transition-colors" />
                <span>Copy to Clipboard</span>
              </button>
            </div>

            <div className="w-full h-[600px] overflow-y-auto bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 relative custom-scrollbar">
              {view === "raw" ? (
                <textarea 
                  value={result} 
                  readOnly
                  className="w-full h-full bg-transparent text-sm font-mono text-gray-300 resize-none focus:outline-none"
                />
              ) : (
                <article className="prose prose-invert prose-neon max-w-none w-full">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result}
                  </ReactMarkdown>
                </article>
              )}
            </div>
          </div>
        )}
      </main>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a0a;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .prose-neon a {
          color: #00e5ff;
          text-decoration: none;
        }
        .prose-neon a:hover {
          text-decoration: underline;
        }
        .prose-neon pre {
          background-color: #000;
          border: 1px solid #333;
        }
        .prose-neon code {
          color: #00e5ff;
          background-color: rgba(0, 229, 255, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
