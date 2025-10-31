export default function ExportButton({ messages = [] }) {
  const download = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date(), messages }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finwisebot_chat_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={download} className="bg-white/5 text-white px-3 py-1 rounded">Export Chat</button>
  );
}
