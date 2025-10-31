import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BacktestChart from '../../components/BacktestChart';

export default function Backtest() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h1 className="text-3xl font-heading mb-4">Backtesting</h1>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <form className="bg-white p-4 rounded shadow flex flex-col gap-3">
              <input placeholder="Ticker (e.g. AAPL)" className="p-2 border rounded" />
              <input placeholder="Capital (USD)" className="p-2 border rounded" />
              <div className="flex gap-2">
                <input type="date" className="p-2 border rounded flex-1" />
                <input type="date" className="p-2 border rounded flex-1" />
              </div>
              <button className="bg-accent text-white p-2 rounded">Run Backtest</button>
            </form>
          </div>

          <div>
            <BacktestChart />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
