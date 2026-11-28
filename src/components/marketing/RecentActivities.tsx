const ITEMS = [
  { text: "New student enrolled", dot: "bg-emerald-500" },
  { text: "Fee payment received", dot: "bg-emerald-500" },
  { text: "Report card generated", dot: "bg-orange-400" },
  { text: "Attendance updated", dot: "bg-orange-400" },
];

export default function RecentActivities() {
  return (
    <div className="rounded-lg bg-white p-3 shadow-sm">
      <div className="text-[11px] font-semibold">Recent Activities</div>
      <ul className="mt-2 space-y-2">
        {ITEMS.map((a) => (
          <li key={a.text} className="flex items-center gap-2 text-[10px] text-slate-600">
            <span className={`h-2.5 w-2.5 rounded-full ${a.dot}`} />
            {a.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
