export default function Footer() {
  return (
    <footer className="mt-12 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between glass border border-white/6 rounded-2xl p-4">
          <div>
            <p className="text-sm text-white/80">&copy; 2025 FinWisebot. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            <a className="text-white/70 text-sm" href="#">GitHub</a>
            <a className="text-white/70 text-sm" href="#">LinkedIn</a>
            <a className="text-white/70 text-sm" href="#">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
