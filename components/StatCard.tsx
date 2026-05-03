interface StatCardProps {
  title: string
  value: string
  sub?: string
  accent?: 'blue' | 'green' | 'yellow' | 'red'
}

const accentMap = {
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  yellow: 'text-yellow-600',
  red: 'text-red-600',
}

export default function StatCard({ title, value, sub, accent = 'blue' }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-2 shadow-sm">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{title}</span>
      <span className={`text-3xl font-bold ${accentMap[accent]}`}>{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  )
}
