import Link from 'next/link';

export default function FeatureCard({ title, description, icon, accent = 'from-green-400 to-emerald-400', slug = '', dark = false }) {
  const containerCls = dark ? 'bg-slate-800/30 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all border border-white/5' : 'bg-gradient-to-br from-white/5 to-white/2 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all';
  const textCls = dark ? 'text-white' : 'text-gray-300';
  const iconText = dark ? 'text-white' : 'text-black/80';

  const inner = (
    <div className={containerCls}>
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${accent} ${iconText} shadow-md`}> 
          {icon}
        </div>
        <div>
          <h3 className={`text-lg font-heading mb-1 ${textCls}`}>{title}</h3>
          <p className={`text-sm ${textCls} text-opacity-80`}>{description}</p>
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
