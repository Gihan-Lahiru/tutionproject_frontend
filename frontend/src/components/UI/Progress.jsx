export default function Progress({ value = 0, className = '' }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
