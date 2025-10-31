export default function FeatureCard({ title, description, icon, accent = 'from-green-400 to-emerald-400' }) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/2 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all">
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${accent} text-black/80 shadow-md`}> 
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-heading mb-1">{title}</h3>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
}
