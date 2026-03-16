'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Pastro gjendjet e vjetra
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Diçka shkoi keq');
      }

      const data = await res.json();
      setResponse(data.reply);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-slate-950/70 backdrop-blur-sm border border-slate-800 rounded-3xl shadow-xl p-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Aplikacioni im AI</h1>
          <p className="mt-2 text-slate-200/80">
            Shkruaj ndonjë pyetje dhe AI do të kthejë një përgjigje të zgjuar.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Shkruaj pyetjen tënde këtu..."
            className="w-full p-4 border border-slate-700 rounded-2xl bg-slate-950/30 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 text-slate-100 h-32 resize-none disabled:opacity-50"
            disabled={loading}
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex-1 bg-blue-600 text-white py-3 rounded-2xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Duke menduar...' : 'Dërgo'}
            </button>

            <button
              type="button"
              onClick={() => {
                setInput('');
                setResponse('');
                setError('');
              }}
              className="flex-1 border border-slate-700 text-slate-100 py-3 rounded-2xl hover:bg-slate-800 transition-colors"
            >
              Pastro
            </button>
          </div>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="mt-6 flex items-center gap-3 text-slate-200">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span>AI po analizon pyetjen tuaj...</span>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="mt-6 p-4 bg-red-950/40 border border-red-700 rounded-2xl text-red-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <strong>Gabim:</strong>
                <div className="mt-1 text-sm text-red-100/90">{error}</div>
              </div>
              <button
                onClick={() => setError('')}
                className="text-sm underline text-red-200/80 hover:text-red-100"
              >
                Mbyll
              </button>
            </div>
          </div>
        )}

        {/* Response state */}
        {response && !loading && (
          <div className="mt-6 p-6 bg-slate-900/50 border border-slate-700 rounded-2xl">
            <h2 className="font-semibold text-blue-200 mb-2">Përgjigja e AI:</h2>
            <p className="text-slate-100 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </main>
  );
}