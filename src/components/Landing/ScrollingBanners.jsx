import { FiAward, FiCheckCircle, FiTrendingUp } from 'react-icons/fi'

const tickerItems = [
  { icon: FiAward, text: 'O/L Science (Grades 6–11)', color: 'from-blue-500 to-indigo-600' },
  { icon: FiTrendingUp, text: 'Proven Top Examination Results', color: 'from-rose-500 to-red-600' },
  { icon: FiCheckCircle, text: 'Deep Concept Clarity', color: 'from-indigo-500 to-cyan-600' },
]

export default function ScrollingBanners() {
  return (
    <div className="relative w-full py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-slate-700/50 overflow-hidden shadow-inner">
      {/* Edge gradient fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 mx-3 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/70 text-slate-200 text-sm font-medium shadow-sm transition-all hover:border-slate-500 hover:text-white hover:scale-105"
            >
              <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span>{item.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
