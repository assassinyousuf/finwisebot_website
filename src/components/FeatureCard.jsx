import Link from 'next/link';

export default function FeatureCard({ title, description, icon, accent = 'from-green-400 to-emerald-400', slug = '', dark = false }) {
  const containerCls = 'p-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-green-400/20 transform hover:-translate-y-1 hover:scale-105 transition-all entrance';
  const textCls = 'text-sm';
  const iconText = 'text-lg';

  const inner = (
    <div className={`${containerCls} glass`} style={{border:'1px solid rgba(255,255,255,0.04)'}}>
      <div className="flex items-start gap-4">
        <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${iconText}`}>
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${accent} opacity-80`} />
          <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/6 border" style={{backdropFilter:'blur(6px)'}}>{icon}</div>
        </div>
        <div>
          <h3 className={`text-lg font-heading mb-1`}>{title}</h3>
          <p className={`${textCls} text-muted`}>{description}</p>
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
