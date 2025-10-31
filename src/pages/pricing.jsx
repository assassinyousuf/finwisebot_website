import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Pricing() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h1 className="text-3xl font-heading mb-4">Pricing</h1>
        <p>Simple pricing tiers coming soon. Contact sales for enterprise plans.</p>
      </main>
      <Footer />
    </div>
  );
}
