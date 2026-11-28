const DATA = [12, 25, 18, 40, 32, 70, 55, 85];
const PTS = DATA.map((v, i) => ({ x: 10 + (i * 200) / (DATA.length - 1), y: 90 - v * 0.8 }));
const LINE = PTS.map((p) => `${p.x},${p.y}`).join(" ");

export default function PerformanceChart() {
  return (
    <div className="rounded-lg bg-white p-3 shadow-sm">
      <div className="text-[11px] font-semibold">Academic Performance</div>
      <svg viewBox="0 0 220 100" className="mt-2 w-full">
        {[10, 37, 63, 90].map((y) => (
          <line key={y} x1="10" x2="210" y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
        ))}
        <polyline points={LINE} fill="none" stroke="#2563eb" strokeWidth="2" />
        {PTS.map((p) => (
          <circle key={p.x} cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#2563eb" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}
