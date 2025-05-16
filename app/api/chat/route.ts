// Bisnes IA - App React con Vercel + OpenRouter
// Archivo: app/page.tsx

'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Actuá como un asesor experto en negocios online. Enseñame paso a paso cómo puedo crear negocios rentables con herramientas gratuitas.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Hubo un error. Intentá de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🤖 Bisnes IA</h1>
      <div className="space-y-2 mb-4 h-[60vh] overflow-y-auto border p-2 rounded">
        {messages.slice(1).map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.role === 'user' ? 'bg-gray-200 text-right' : 'bg-blue-100 text-left'}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">Bisnes IA escribiendo...</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Preguntale algo a Bisnes IA..."
        />
        <button className="bg-black text-white px-4 py-2 rounded" onClick={sendMessage} disabled={loading}>
          Enviar
        </button>
      </div>
    </main>
  );
}

// Archivo: app/api/chat/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://bisnes-ia.vercel.app',
      'X-Title': 'Bisnes IA',
    },
    body: JSON.stringify({
      model: 'mistral/mistral-7b-instruct',
      messages,
    }),
  });

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content || 'Error de respuesta';

  return NextResponse.json({ message });
}
