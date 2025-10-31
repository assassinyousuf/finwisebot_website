export default function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-secondary p-6 rounded-lg shadow hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-heading mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
