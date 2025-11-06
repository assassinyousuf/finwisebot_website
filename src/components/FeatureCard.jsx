import Link from 'next/link';

export default function FeatureCard({ title, description, icon, accent = 'from-cyan-400 to-blue-500', slug = '', dark = false }) {
  const containerCls = 'p-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-400/20 transform hover:-translate-y-1 hover:scale-105 transition-all entrance bg-white/5 backdrop-blur-sm border border-white/10';
  const textCls = 'text-sm text-gray-300';
  const iconText = 'text-lg';

  const inner = (
    <div className={containerCls}>
      <div className="flex items-start gap-4">
        <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${iconText}`}>
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${accent} opacity-80`} />
          <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-sm">{icon}</div>
        </div>
        <div>
          <h3 className={`text-lg font-semibold mb-1 text-white`}>{title}</h3>
          <p className={textCls}>{description}</p>
        </div>
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link href={`/coming-soon/${slug}`}>
        {inner}
      </Link>
    );
  }

  return inner;
}
