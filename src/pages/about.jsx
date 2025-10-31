import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function About() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h1 className="text-3xl font-heading mb-4">About FinWisebot</h1>
        <p className="mb-2">FinWisebot combines AI research and market data to deliver transparent financial insights.</p>
      </main>
      <Footer />
    </div>
  );
}
