import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import mockApi from '../../lib/mockApi';

const PredictionWidget = dynamic(() => import('../../components/PredictionWidget'), { ssr: false });

export default function AdminMLPage() {
  const [history, setHistory] = useState([]);

  async function loadHistory() {
    const j = await mockApi.getPredictions();
    if (j && j.ok) setHistory(j.docs || []);
  }

  useEffect(() => { loadHistory(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ML / Predictions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <PredictionWidget />
        </div>
        <div className="col-span-2">
          <h2 className="font-semibold mb-2">Recent Predictions</h2>
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h._id} className="p-3 bg-white/3 rounded">
                <div className="text-sm">{h.input?.symbol || '—'} @ {new Date(h.createdAt).toLocaleString()}</div>
                <pre className="mt-1 text-xs">{JSON.stringify(h.output, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
