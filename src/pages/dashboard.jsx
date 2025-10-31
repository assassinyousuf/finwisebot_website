import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { saveStructure, loadStructure, clearStructure, STORAGE_KEY } from '../../utils/storage';

const defaultStructure = {
  name: 'FinWisebot-Website',
  children: [
    { name: 'public', children: ['images', 'favicon.ico'] },
    {
      name: 'src',
      children: [
        { name: 'components', children: ['Navbar.jsx', 'Footer.jsx', 'FeatureCard.jsx', 'ChatBubble.jsx', 'BacktestChart.jsx', 'TestimonialCard.jsx'] },
        { name: 'pages', children: ['index.jsx', 'about.jsx', 'features.jsx', 'demo.jsx', 'pricing.jsx', 'login.jsx', 'signup.jsx', 'contact.jsx', 'dashboard.jsx', 'backtest.jsx', { name: 'api', children: ['chat.js', 'backtest.js'] }, '_app.jsx'] },
        { name: 'styles', children: ['globals.css', 'components.css'] },
        { name: 'api', children: ['auth.js (optional)'] },
        { name: 'utils', children: ['helpers.js', 'storage.js'] }
      ]
    },
    'package.json',
    'tailwind.config.js',
    'postcss.config.js',
    'START.md'
  ]
};

export default function Dashboard() {
  const [structureText, setStructureText] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loaded = loadStructure();
    if (loaded) {
      setStructureText(JSON.stringify(loaded, null, 2));
      setStatus('Loaded structure from localStorage');
    } else {
      setStructureText(JSON.stringify(defaultStructure, null, 2));
      setStatus('Showing default structure (not saved)');
    }
  }, []);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(structureText);
      saveStructure(parsed);
      setStatus('Structure saved to localStorage');
    } catch (err) {
      setStatus('Invalid JSON — save failed');
    }
  };

  const handleLoad = () => {
    const loaded = loadStructure();
    if (loaded) {
      setStructureText(JSON.stringify(loaded, null, 2));
      setStatus('Structure loaded from localStorage');
    } else {
      setStatus('No structure found in localStorage');
    }
  };

  const handleClear = () => {
    clearStructure();
    setStructureText(JSON.stringify(defaultStructure, null, 2));
    setStatus('Structure cleared from localStorage');
  };

  const handleSaveDefault = () => {
    saveStructure(defaultStructure);
    setStatus('Default structure saved to localStorage');
  };

  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h1 className="text-3xl font-heading mb-4">Dashboard</h1>
        <p className="mb-4">Store or manage the project structure in your browser's localStorage.</p>

        <div className="mb-4">
          <div className="mb-2 text-sm text-gray-600">localStorage key: <code>{STORAGE_KEY}</code></div>
          <textarea
            className="w-full h-64 p-3 border rounded font-mono bg-white"
            value={structureText}
            onChange={(e) => setStructureText(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={handleSave} className="bg-accent text-white px-4 py-2 rounded">Save Structure</button>
          <button onClick={handleLoad} className="bg-gray-200 px-4 py-2 rounded">Load Structure</button>
          <button onClick={handleClear} className="bg-red-500 text-white px-4 py-2 rounded">Clear Structure</button>
          <button onClick={handleSaveDefault} className="bg-blue-600 text-white px-4 py-2 rounded">Save Default</button>
        </div>

        <div className="text-sm text-gray-700">{status}</div>
      </main>
      <Footer />
    </div>
  );
}
