export default function Footer() {
  return (
    <footer className="mt-12 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between glass border rounded-2xl p-4">
          <div>
            <p className="text-sm" style={{color:'var(--muted)'}}>&copy; 2025 FinWisebot. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            <a className="text-sm" style={{color:'var(--muted)'}} href="#">GitHub</a>
            <a className="text-sm" style={{color:'var(--muted)'}} href="#">LinkedIn</a>
            <a className="text-sm" style={{color:'var(--muted)'}} href="#">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
