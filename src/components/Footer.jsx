export default function Footer() {
  return (
    <footer className="mt-8 sm:mt-12 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between glass border rounded-2xl p-4 gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm" style={{color:'var(--muted)'}}>&copy; 2025 FinWisebot. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a className="text-sm hover:text-white transition" style={{color:'var(--muted)'}} href="#">GitHub</a>
            <a className="text-sm hover:text-white transition" style={{color:'var(--muted)'}} href="#">LinkedIn</a>
            <a className="text-sm hover:text-white transition" style={{color:'var(--muted)'}} href="#">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
