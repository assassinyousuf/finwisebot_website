export default function ChatBubble({ message }) {
  const isUser = message.type === 'user';
  return (
    <div className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg max-w-xs ${isUser ? 'bg-accent text-white' : 'bg-gray-200 text-black'}`}>
        {message.text}
      </div>
    </div>
  );
}
