import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-primary text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-heading">FinWisebot</h1>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/features">Features</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/demo">Demo</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
