export default function DemoBackground() {
  return (
    <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
      {/* large soft gradient blob (inspired by langui HeroGradient) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -top-40 w-[1200px] h-[700px] rounded-[40%] bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] opacity-20 blur-3xl animate-blob-slow"></div>

      {/* layered svg waves for a subtle moving background */}
      <div className="absolute inset-x-0 bottom-0 h-64 wave-wrapper">
        <svg viewBox="0 0 1440 320" className="wave w-full h-full">
          <path fill="rgba(99,102,241,0.06)" d="M0,160L48,149.3C96,139,192,117,288,133.3C384,149,480,203,576,208C672,213,768,171,864,149.3C960,128,1056,128,1152,128C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg viewBox="0 0 1440 320" className="wave wave-slow w-full h-full">
          <path fill="rgba(14,165,233,0.04)" d="M0,96L48,122.7C96,149,192,203,288,229.3C384,256,480,256,576,213.3C672,171,768,85,864,74.7C960,64,1056,128,1152,154.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}
