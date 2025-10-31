import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <div>
      <Navbar />
      <main className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-heading mb-4">Contact</h1>
        <p className="mb-4">Questions or partnership inquiries? Send us a message.</p>
        <form className="bg-white p-6 rounded shadow flex flex-col gap-3">
          <input placeholder="Name" className="p-2 border rounded" />
          <input placeholder="Email" className="p-2 border rounded" />
          <textarea placeholder="Message" className="p-2 border rounded" rows={6}></textarea>
          <button className="bg-accent text-white p-2 rounded">Send</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
