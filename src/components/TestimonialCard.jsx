export default function TestimonialCard({ author, text }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="mb-2">“{text}”</p>
      <p className="text-sm text-gray-600">— {author}</p>
    </div>
  );
}
